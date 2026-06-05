# Fix Collation Mismatch in JOIN ON Clause

When joining tables with different collations in MySQL, you can directly force the collation conversion in the `ON` clause without subqueries or aliases.

This is the **MySQL official standard syntax** - the simplest and most commonly used approach.

## Final Syntax (Copy and Use Directly in ON)

```sql
ON 
t1.col COLLATE utf8mb4_0900_ai_ci 
= 
t2.col COLLATE utf8mb4_0900_ai_ci
```

---

## Complete Runnable Example

```sql
SELECT * 
FROM table1 t1 
JOIN table2 t2 
ON 
  t1.user_code COLLATE utf8mb4_0900_ai_ci 
  = 
  t2.user_code COLLATE utf8mb4_0900_ai_ci
```

---

## Convert Only One Side (Simpler)

If only **t1 is utf8mb4_unicode_ci** and t2 already has the target collation, just convert one side:

```sql
ON t1.col COLLATE utf8mb4_0900_ai_ci = t2.col
```

---

## Core Knowledge Points

- **`COLLATE`** = Force specify collation
- **`utf8mb4_unicode_ci` → Convert to → `utf8mb4_0900_ai_ci`**
- **Write directly after the field name**, no CONVERT needed, no subquery needed, no AS needed

---

## One-Sentence Summary

**field_name COLLATE target_collation**

```sql
t1.col COLLATE utf8mb4_0900_ai_ci
```

---

## Common Use Cases

### Case 1: Different Collations Between Tables

```sql
-- Table1 uses utf8mb4_unicode_ci
-- Table2 uses utf8mb4_0900_ai_ci
SELECT * 
FROM table1 t1
INNER JOIN table2 t2 
ON t1.code COLLATE utf8mb4_0900_ai_ci = t2.code
```

### Case 2: LEFT JOIN with Collation Conversion

```sql
SELECT *
FROM users u
LEFT JOIN orders o
ON u.user_code COLLATE utf8mb4_0900_ai_ci = o.user_code
```

### Case 3: Multiple JOIN Conditions

```sql
SELECT *
FROM table1 t1
JOIN table2 t2 
  ON t1.code COLLATE utf8mb4_0900_ai_ci = t2.code
  AND t1.status = t2.status
```

---

## Available Collations in MySQL 8.0+

- `utf8mb4_0900_ai_ci` - Default for MySQL 8.0+, accent-insensitive, case-insensitive
- `utf8mb4_unicode_ci` - Legacy Unicode collation
- `utf8mb4_bin` - Binary collation (case-sensitive)
- `utf8mb4_general_ci` - Legacy general collation

To check available collations:

```sql
SHOW COLLATION LIKE 'utf8mb4%';
```

---

## Performance Tips

- Converting collation in `ON` clause may prevent index usage
- For better performance, consider altering table collation:
  ```sql
  ALTER TABLE table1 
  MODIFY COLUMN code VARCHAR(255) 
  COLLATE utf8mb4_0900_ai_ci;
  ```
- Use one-side conversion when possible for cleaner queries
