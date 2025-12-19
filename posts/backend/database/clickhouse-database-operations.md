# ClickHouse Database Operations
## View table creation statement and engine type
```sql
SELECT
    create_table_query,
    engine_full
FROM system.tables
WHERE database = 'database_name' AND name = 'table_name';
```

## View the actual effective value of max_parts_in_total for database_name.table_name table
```sql
SELECT
  *
FROM system.merge_tree_settings
    WHERE
    name = 'max_parts_in_total';
```

## View the number of table partitions
```sql
SELECT parts FROM system.tables WHERE database = 'database_name' AND name = 'table_name';
```

## Compatible with older versions: use MODIFY SETTING (singular), permanent effect
```sql
ALTER TABLE database_name.table_name
    MODIFY SETTING max_parts_in_total = 100000;
```

## Simplified version: only query partition key and row count
```sql
SELECT partition, rows FROM system.parts WHERE table='table_name' LIMIT 10000;
```

## Delete all data
```sql
SET mutations_sync = 1; -- Execute mutations synchronously
ALTER TABLE database_name.table_name DELETE WHERE 1=1; -- Delete all data
SET mutations_sync = default;
```