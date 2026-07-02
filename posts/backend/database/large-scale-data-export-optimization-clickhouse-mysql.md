# Large-Scale Data Export Optimization: ClickHouse + MySQL

## I. Background

When handling million-scale data export scenarios, complex queries directly in MySQL face performance bottlenecks. This solution adopts a hybrid architecture of **ClickHouse pre-filtering + MySQL detail query**, combined with temporary tables to replace IN queries, achieving efficient data export. It takes less than 4 minutes to export 1 million records.

## II. Core Design Concept

### 2.1 Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                      │
│  Concurrency Control → ClickHouse Query → MySQL Details →  │
│           Data Assembly → File Export                       │
└─────────────────────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────┐  ┌─────────────────┐
│   ClickHouse    │  │     MySQL       │
│  (Pre-filter ID)│  │  (Query Details)│
└─────────────────┘  └─────────────────┘
```

### 2.2 Query Flow

```
1. ClickHouse Query: Filter target ID list by conditions (max 200k per batch)
2. Create Temporary Table: Insert ID list into MySQL temporary table
3. MySQL Query: Get complete detail data via JOIN with temporary table
4. Data Assembly: Convert query results to export format
5. File Generation: Generate one file per 500k records
6. Loop Pagination: Use ID descending pagination until no more data
```

## III. Key Implementation

### 3.1 ClickHouse Pre-filtering

```sql
-- Pre-filter IDs from wide table
SELECT
    order_id AS id,
    business_id
FROM wide_order_table FINAL
WHERE 
    status IN (1, 2, 3)
    AND create_time >= '2026-01-01'
    AND order_id < 123456789
ORDER BY order_id DESC
LIMIT 200000
```

**Advantages:**
- ClickHouse columnar storage is ideal for large-scale data filtering
- `FINAL` keyword ensures data consistency
- Limit 200k per query to avoid memory overflow

### 3.2 Temporary Table Replaces IN Query

**Traditional Approach (Not Recommended):**

```sql
-- IN query performs poorly with large ID sets
SELECT * FROM order_detail 
WHERE id IN (1, 2, 3, ..., 200000)
```

**Optimized Approach (Recommended):**

```sql
-- Step 1: Create temporary table (with index)
CREATE TEMPORARY TABLE tmp_order_ids (
    id BIGINT,
    INDEX idx_id (id)
)

-- Step 2: Batch insert data (1000 per batch)
INSERT INTO tmp_order_ids (id) VALUES 
(1), (2), (3), ..., (1000)

-- Step 3: Query details via JOIN
SELECT od.*, oi.info 
FROM order_detail od
INNER JOIN tmp_order_ids tmp ON tmp.id = od.id
ORDER BY od.id DESC
```

**Why Temporary Table is Better:**

| Comparison | IN Query | Temporary Table JOIN |
|------------|----------|---------------------|
| Query Performance | O(n) Full Table Scan | O(log n) Index Scan |
| Data Limit | MySQL limits IN parameters | Unlimited |
| Memory Usage | High (needs temp set) | Low (uses index) |
| Readability | Poor (super long SQL) | Good (clear logic) |

### 3.3 Pagination Strategy

Use **ID Descending Pagination** instead of traditional `LIMIT offset, size`:

```sql
-- Page N query
SELECT order_id, business_id
FROM wide_order_table FINAL
WHERE order_id < last_page_min_id  -- Key point
ORDER BY order_id DESC
LIMIT 200000
```

**Advantages:**
- Avoids performance issues when offset is large in `LIMIT offset, size`
- Uses primary key index for stable query efficiency
- Naturally supports breakpoint resume

### 3.4 Concurrency Control

Use Semaphore to limit concurrency (default 10 concurrent):

```java
// Initialize semaphore
Semaphore semaphore = new Semaphore(10);

// Acquire permit
semaphore.acquire();
try {
    // Query logic
} finally {
    semaphore.release();  // Release permit
}
```

**Protection Scope:** Only acquire permits during ClickHouse queries to avoid exhausting database connection pool.

## IV. Complete Code Example

### 4.1 Core Flow

```java
while (true) {
    // 1. ClickHouse Query IDs
    semaphore.acquire();
    try {
        String chSql = buildChQuery(lastId, conditions);
        List<Long> ids = chClient.queryForList(chSql, Long.class);
        
        if (ids.isEmpty()) {
            break;
        }
        
        // 2. Create temporary table and insert data
        String tempTable = createTempTable(jdbcTemplate);
        batchInsert(jdbcTemplate, tempTable, ids);
        
        // 3. MySQL Query Details
        String sql = buildMysqlQuery(tempTable);
        List<Detail> details = jdbcTemplate.query(sql, detailMapper);
        
        // 4. Data assembly and file generation
        for (Detail data : details) {
            String[] row = assembleRow(data);
            result.add(row);
            
            if (result.size() >= 500000) {
                exportToFile(result);
                result.clear();
            }
        }
        
        // 5. Update pagination position
        lastId = ids.get(ids.size() - 1);
    } finally {
        semaphore.release();
    }
}
```

### 4.2 Temporary Table Operation Encapsulation

```java
public List<Detail> queryWithTempTable(JdbcTemplate jdbcTemplate, List<Long> ids) {
    // Create temporary table
    String tempName = "tmp_ids_" + System.currentTimeMillis();
    String createSql = String.format(
        "CREATE TEMPORARY TABLE %s (id BIGINT, INDEX idx_id (id))",
        tempName
    );
    jdbcTemplate.execute(createSql);
    
    // Batch insert
    for (int i = 0; i < ids.size(); i += 1000) {
        int end = Math.min(i + 1000, ids.size());
        List<Long> batch = ids.subList(i, end);
        
        StringBuilder values = new StringBuilder();
        for (int j = 0; j < batch.size(); j++) {
            if (j > 0) values.append(",");
            values.append("(").append(batch.get(j)).append(")");
        }
        
        String insertSql = String.format(
            "INSERT INTO %s (id) VALUES %s",
            tempName,
            values.toString()
        );
        jdbcTemplate.execute(insertSql);
    }
    
    // Query
    String query = String.format(
        "SELECT od.*, oi.info FROM order_detail od " +
        "INNER JOIN %s tmp ON tmp.id = od.id ORDER BY od.id DESC",
        tempName
    );
    
    return jdbcTemplate.query(query, detailMapper);
}
```

## V. Performance Comparison

| Metric | Traditional Approach | Optimized Approach |
|--------|---------------------|--------------------|
| Single Query Time | 30-60 seconds | 5-10 seconds |
| 1M Data Export | 20+ minutes | **Less than 4 minutes** |
| Memory Peak | 1.5GB+ | 500MB |
| DB Connections | Unstable | Controlled (10) |

## VI. Notes

### 6.1 Temporary Table Isolation

Each query batch uses a unique temporary table name to avoid concurrency conflicts:

```java
String tempTableName = "tmp_order_ids_" + exportKey + "_" + batchCount;
```

### 6.2 Exception Handling

Ensure resources are released under any exception:

```java
boolean shouldRelease = true;
try {
    semaphore.acquire();
    // Query logic
    shouldRelease = false;
} finally {
    if (shouldRelease) {
        semaphore.release();
    }
}
```

### 6.3 Retry Mechanism

Add retry for ClickHouse queries to handle network fluctuations:

```java
int maxRetries = 3;
Exception lastException = null;
for (int retry = 0; retry < maxRetries; retry++) {
    try {
        List<Long> ids = chClient.queryForList(chSql, Long.class);
        return ids;
    } catch (Exception e) {
        lastException = e;
        if (retry < maxRetries - 1) {
            Thread.sleep((retry + 1) * 500L);
        }
    }
}
throw lastException;
```

## VII. Summary

This solution achieves performance optimization for large-scale data export through the following strategies:

1. **Layered Query**: ClickHouse handles pre-filtering, MySQL handles detail queries
2. **Temporary Table Optimization**: Replace IN queries with JOIN for better efficiency
3. **Pagination Strategy**: ID descending pagination avoids offset performance issues
4. **Concurrency Control**: Limit database query concurrency to protect resources
5. **Batch Export**: Generate one file per 500k records to control memory usage

It takes less than 4 minutes to export 1 million records. This pattern is suitable for scenarios requiring detailed information export from massive datasets, such as order export, logistics tracking export, etc.
