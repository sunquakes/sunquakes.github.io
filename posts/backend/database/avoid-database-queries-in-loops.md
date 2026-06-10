# Avoid Database Queries in Large Data Loops

When processing large volumes of data, one of the most critical performance optimizations is to **never query the database (MySQL, Redis, etc.) inside a loop**. This article explains why and how to optimize data assembly for large datasets, based on real-world production experience.

## The Problem

Consider a scenario where you need to process 10,000 records and enrich each one with additional data from the database.

### ❌ Bad Practice: Query Inside Loop

```java
// BAD: Querying database inside loop
List<Order> orders = orderMapper.selectAllOrders(); // 10,000 orders

for (Order order : orders) {
    // Query user info for each order - 10,000 queries!
    User user = userMapper.selectById(order.getUserId());
    order.setUserName(user.getName());
    
    // Query product info - another 10,000 queries!
    Product product = productMapper.selectById(order.getProductId());
    order.setProductName(product.getName());
    
    // Query from Redis - 10,000 Redis calls!
    String cache = redis.get("order:status:" + order.getId());
    order.setStatus(cache);
}
```

**Performance Impact:**
- 30,000+ database queries (MySQL + Redis)
- Network latency: ~1-5ms per query × 30,000 = 30-150 seconds
- Database connection pool exhaustion
- High CPU and memory usage
- **Production incident waiting to happen**

### ✅ Good Practice: Batch Query + In-Memory Assembly

```java
// GOOD: Batch query first, then assemble in memory
List<Order> orders = orderMapper.selectAllOrders(); // 10,000 orders

// Step 1: Collect all IDs
Set<Long> userIds = orders.stream()
    .map(Order::getUserId)
    .collect(Collectors.toSet());

Set<Long> productIds = orders.stream()
    .map(Order::getProductId)
    .collect(Collectors.toSet());

Set<Long> orderIds = orders.stream()
    .map(Order::getId)
    .collect(Collectors.toSet());

// Step 2: Batch query all related data (only 3 queries!)
Map<Long, User> userMap = userMapper.selectByIds(userIds)
    .stream()
    .collect(Collectors.toMap(User::getId, Function.identity()));

Map<Long, Product> productMap = productMapper.selectByIds(productIds)
    .stream()
    .collect(Collectors.toMap(Product::getId, Function.identity()));

Map<Long, String> statusMap = redis.mget(
    orderIds.stream()
        .map(id -> "order:status:" + id)
        .collect(Collectors.toList())
);

// Step 3: Assemble data in memory (no database calls)
for (Order order : orders) {
    User user = userMap.get(order.getUserId());
    if (user != null) {
        order.setUserName(user.getName());
    }
    
    Product product = productMap.get(order.getProductId());
    if (product != null) {
        order.setProductName(product.getName());
    }
    
    order.setStatus(statusMap.get(order.getId()));
}
```

**Performance Impact:**
- Only 3 queries total (vs 30,000+)
- Network latency: ~3-15ms total
- **100-1000x faster execution**

## Batch Query Implementation Examples

### MySQL - IN Clause

```java
// Mapper interface
@Mapper
public interface UserMapper {
    @Select("<script>" +
            "SELECT * FROM user WHERE id IN " +
            "<foreach item='id' collection='ids' open='(' separator=',' close=')'>" +
            "#{id}" +
            "</foreach>" +
            "</script>")
    List<User> selectByIds(@Param("ids") Collection<Long> ids);
}
```

### Redis - MGET/MSET

```java
// Batch get from Redis
public Map<Long, String> batchGetOrderStatus(List<Long> orderIds) {
    List<String> keys = orderIds.stream()
        .map(id -> "order:status:" + id)
        .collect(Collectors.toList());
    
    List<String> values = redisTemplate.opsForValue().multiGet(keys);
    
    Map<Long, String> result = new HashMap<>();
    for (int i = 0; i < orderIds.size(); i++) {
        result.put(orderIds.get(i), values.get(i));
    }
    return result;
}

// Batch set to Redis
public void batchSetOrderStatus(Map<Long, String> statusMap) {
    Map<String, String> keyValueMap = statusMap.entrySet().stream()
        .collect(Collectors.toMap(
            e -> "order:status:" + e.getKey(),
            Map.Entry::getValue
        ));
    
    redisTemplate.opsForValue().multiSet(keyValueMap);
}
```

## Performance Comparison

| Approach | Queries | Time (10K records) | Memory | DB Load |
|----------|---------|-------------------|--------|---------|
| Query in Loop | 30,000+ | 30-150s | Low | **Critical** |
| Batch Query | 3 | 0.5-2s | Medium | Normal |
| **Improvement** | **10,000x** | **50-100x** | - | **99% reduction** |

## Best Practices

### 1. Always Batch Query First

```java
// ✅ Correct: Collect IDs → Batch Query → Assemble
Set<Long> ids = collectIds(dataList);
Map<Long, Entity> entityMap = batchQuery(ids);
assembleInMemory(dataList, entityMap);
```

### 2. Use IN Clause with Limits

```java
// MySQL IN clause has limits (max_allowed_packet)
// Split into batches of 1000 IDs
public <T> List<T> batchQueryWithLimit(Collection<Long> ids, Function<List<Long>, List<T>> queryFunc) {
    List<T> result = new ArrayList<>();
    List<Long> idList = new ArrayList<>(ids);
    
    int batchSize = 1000;
    for (int i = 0; i < idList.size(); i += batchSize) {
        int end = Math.min(i + batchSize, idList.size());
        List<Long> batch = idList.subList(i, end);
        result.addAll(queryFunc.apply(batch));
    }
    
    return result;
}
```

### 3. Handle Missing Data Gracefully

```java
// Always check for null/missing data
User user = userMap.get(order.getUserId());
if (user != null) {
    order.setUserName(user.getName());
} else {
    order.setUserName("Unknown"); // Default value
    log.warn("User not found for order: {}", order.getId());
}
```

### 4. Consider Memory vs Performance Trade-off

```java
// For extremely large datasets, process in chunks
int chunkSize = 10000;
for (int i = 0; i < totalRecords; i += chunkSize) {
    List<Order> chunk = orderMapper.selectByRange(i, chunkSize);
    processChunk(chunk);
}
```

### 5. Use Parallel Processing for CPU-Bound Assembly

```java
// After batch query, use parallel stream for CPU-intensive assembly
orders.parallelStream().forEach(order -> {
    // In-memory operations only - no database calls
    order.setUserName(userMap.get(order.getUserId()).getName());
    order.setProductName(productMap.get(order.getProductId()).getName());
});
```

## Common Pitfalls to Avoid

### ❌ Pitfall 1: N+1 Query Problem in ORM

```java
// JPA/Hibernate may trigger lazy loading in loop
List<Order> orders = orderRepository.findAll();
for (Order order : orders) {
    order.getUser().getName(); // Triggers query!
}

// Solution: Use JOIN FETCH
@Query("SELECT o FROM Order o JOIN FETCH o.user")
List<Order> findAllWithUser();

// Or use EntityGraph
@EntityGraph(attributePaths = {"user"})
List<Order> findAll();
```

### ❌ Pitfall 2: Redis Pipeline Misuse

```java
// Bad: Pipeline with single commands
for (String key : keys) {
    redisTemplate.opsForValue().get(key); // Still N calls
}

// Good: Use multiGet
List<String> values = redisTemplate.opsForValue().multiGet(keys);

// Or use Pipeline correctly
List<Object> results = redisTemplate.executePipelined((RedisCallback<Object>) connection -> {
    for (String key : keys) {
        connection.get(key.getBytes());
    }
    return null;
});
```

### ❌ Pitfall 3: Not Using Connection Pooling

```java
// Bad: Create new connection per query
for (Long id : ids) {
    Connection conn = DriverManager.getConnection(url); // Expensive!
    // query...
    conn.close();
}

// Good: Use connection pool (HikariCP, etc.)
@Resource
private DataSource dataSource; // Pooled connections
```

### ❌ Pitfall 4: Querying in Nested Loops

```java
// Bad: Nested loops with queries - O(n*m) queries!
for (Order order : orders) {
    for (Item item : order.getItems()) {
        Product product = productMapper.selectById(item.getProductId());
        item.setProductName(product.getName());
    }
}

// Good: Flatten and batch query
Set<Long> productIds = orders.stream()
    .flatMap(o -> o.getItems().stream())
    .map(Item::getProductId)
    .collect(Collectors.toSet());

Map<Long, Product> productMap = batchQueryProducts(productIds);

for (Order order : orders) {
    for (Item item : order.getItems()) {
        item.setProductName(productMap.get(item.getProductId()).getName());
    }
}
```

### ❌ Pitfall 5: Using COUNT(*) in Loop for Existence Check

```java
// Bad: COUNT(*) in loop
for (Order order : orders) {
    int count = orderMapper.countByUserId(order.getUserId());
    if (count > 0) {
        // process...
    }
}

// Good: Batch check with IN clause
Set<Long> userIds = orders.stream().map(Order::getUserId).collect(Collectors.toSet());
Set<Long> existingUserIds = orderMapper.findExistingUserIds(userIds);

for (Order order : orders) {
    if (existingUserIds.contains(order.getUserId())) {
        // process...
    }
}
```

### ❌ Pitfall 6: Not Handling Duplicate IDs

```java
// Bad: May cause duplicate queries
List<Long> userIds = orders.stream()
    .map(Order::getUserId)
    .collect(Collectors.toList()); // Duplicates possible!

// Good: Use Set to deduplicate
Set<Long> userIds = orders.stream()
    .map(Order::getUserId)
    .collect(Collectors.toSet()); // Unique IDs only
```

### ❌ Pitfall 7: Querying in Stream Operations

```java
// Bad: Query in map/filter operations
List<Order> enriched = orders.stream()
    .map(order -> {
        User user = userMapper.selectById(order.getUserId()); // N queries!
        order.setUserName(user.getName());
        return order;
    })
    .collect(Collectors.toList());

// Good: Batch query before stream
Map<Long, User> userMap = batchQueryUsers(orders);
List<Order> enriched = orders.stream()
    .map(order -> {
        order.setUserName(userMap.get(order.getUserId()).getName());
        return order;
    })
    .collect(Collectors.toList());
```

### ❌ Pitfall 8: Not Using Cache for Static Data

```java
// Bad: Query static data repeatedly
for (Order order : orders) {
    Region region = regionMapper.selectById(order.getRegionId()); // Static data!
}

// Good: Cache static data
@Cacheable(value = "regions", key = "#id")
public Region getRegionById(Long id) {
    return regionMapper.selectById(id);
}

// Or load all static data once
Map<Long, Region> regionMap = regionMapper.selectAll()
    .stream()
    .collect(Collectors.toMap(Region::getId, Function.identity()));
```

### ❌ Pitfall 9: Using SELECT * for Batch Queries

```java
// Bad: SELECT * returns unnecessary columns
@Select("SELECT * FROM user WHERE id IN (...)")
List<User> selectByIds(Collection<Long> ids);

// Good: Select only needed columns
@Select("SELECT id, name FROM user WHERE id IN (...)")
List<User> selectByIds(Collection<Long> ids);
```

### ❌ Pitfall 10: Not Batching Writes

```java
// Bad: Insert in loop
for (Order order : orders) {
    orderMapper.insert(order); // N inserts!
}

// Good: Batch insert
@Insert("<script>" +
        "INSERT INTO order (id, user_id, amount) VALUES " +
        "<foreach item='order' collection='orders' separator=','>" +
        "(#{order.id}, #{order.userId}, #{order.amount})" +
        "</foreach>" +
        "</script>")
void batchInsert(@Param("orders") List<Order> orders);
```

## Advanced Techniques

### 1. Two-Phase Loading for Complex Data

```java
// Phase 1: Load primary data
List<Order> orders = orderMapper.selectAll();

// Phase 2: Load related data in parallel
CompletableFuture<Map<Long, User>> userFuture = CompletableFuture.supplyAsync(
    () -> batchQueryUsers(orders)
);
CompletableFuture<Map<Long, Product>> productFuture = CompletableFuture.supplyAsync(
    () -> batchQueryProducts(orders)
);
CompletableFuture<Map<Long, String>> statusFuture = CompletableFuture.supplyAsync(
    () -> batchQueryStatus(orders)
);

// Wait for all and assemble
CompletableFuture.allOf(userFuture, productFuture, statusFuture).join();

Map<Long, User> userMap = userFuture.get();
Map<Long, Product> productMap = productFuture.get();
Map<Long, String> statusMap = statusFuture.get();

// Assemble in memory
assembleOrders(orders, userMap, productMap, statusMap);
```

### 2. Use Bloom Filter for Existence Check

```java
// For large datasets, use Bloom Filter to avoid unnecessary queries
BloomFilter<Long> existingUserIds = bloomFilterService.getUserFilter();

Set<Long> userIdsToQuery = orders.stream()
    .map(Order::getUserId)
    .filter(userId -> !existingUserIds.mightContain(userId))
    .collect(Collectors.toSet());

// Only query IDs not in Bloom Filter
Map<Long, User> userMap = batchQueryUsers(userIdsToQuery);
```

### 3. Use Local Cache for Hot Data

```java
// Cache frequently accessed data locally
private LoadingCache<Long, User> userCache = Caffeine.newBuilder()
    .maximumSize(10000)
    .expireAfterWrite(10, TimeUnit.MINUTES)
    .build(userId -> userMapper.selectById(userId));

// Use cache in loop (only queries cache miss)
for (Order order : orders) {
    User user = userCache.get(order.getUserId());
    order.setUserName(user.getName());
}
```

## Monitoring and Diagnosis

### How to Detect N+1 Query Problem

1. **Enable SQL Logging**
```yaml
# application.yml
mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

2. **Use Database Monitoring Tools**
   - MySQL: Slow Query Log, Performance Schema
   - PostgreSQL: pg_stat_statements
   - Redis: SLOWLOG

3. **APM Tools**
   - New Relic, Datadog, SkyWalking
   - They automatically detect N+1 queries

4. **Custom Metrics**
```java
// Track query count per operation
AtomicInteger queryCount = new AtomicInteger(0);
 
// Monitor in logs
log.info("Processed {} orders with {} queries", orders.size(), queryCount.get());
// Alert if queries > orders.size() * 2
```

## Real-World Case Studies

### Case 1: E-commerce Order Export

**Problem**: Export 50,000 orders to Excel, taking 10+ minutes

**Root Cause**: Querying user, product, and status in loop

**Solution**: Batch query + in-memory assembly

**Result**: Reduced to 15 seconds (40x faster)

### Case 2: Report Generation

**Problem**: Daily report generation timeout

**Root Cause**: Multiple nested loops with database queries

**Solution**: 
1. Batch query all data upfront
2. Use parallel processing for assembly
3. Write results in batches

**Result**: Reduced from 30 minutes to 2 minutes

### Case 3: Data Migration

**Problem**: Migration of 1M records failing with OOM

**Root Cause**: Loading all data into memory at once

**Solution**: 
1. Process in chunks of 10,000
2. Batch query related data per chunk
3. Clear memory after each chunk

**Result**: Successfully migrated all data

## Summary

When processing large datasets:

1. **Never query database inside loops** - This is the #1 performance killer
2. **Batch query all needed data upfront** - Reduce N queries to 1-3 queries
3. **Assemble data in memory** - Use Maps for O(1) lookups
4. **Handle large batches in chunks** - Balance memory and performance
5. **Use parallel processing** - For CPU-bound in-memory operations
6. **Cache static data** - Avoid repeated queries for reference data
7. **Monitor query patterns** - Use APM tools to detect N+1 problems early

**Remember**: Every query inside a loop is a performance bottleneck waiting to happen. The goal is to minimize database round-trips and maximize in-memory processing.

## Quick Checklist

Before deploying any data processing code:

- [ ] No database queries inside loops
- [ ] No Redis calls inside loops
- [ ] Using batch queries (IN clause, multiGet)
- [ ] Handling null/missing data gracefully
- [ ] Deduplicating IDs before batch query
- [ ] Selecting only needed columns
- [ ] Using connection pooling
- [ ] Processing large datasets in chunks
- [ ] Monitoring query count in logs
- [ ] Tested with production-like data volume
