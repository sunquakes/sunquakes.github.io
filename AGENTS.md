# AGENTS.md - Article Writing Guidelines

## Article File Naming Conventions

### Core Principle

**Filename MUST match the article title exactly.**

- Use **lowercase** letters
- Use **hyphens (-)** to separate words
- The filename should be a direct transformation of the title

**Examples:**
- ✅ Title: `# Avoid Database Queries in Large Data Loops`
  - Filename: `avoid-database-queries-in-large-data-loops.md`
- ✅ Title: `# Optimize Data Sync Script Performance`
  - Filename: `optimize-data-sync-script-performance.md`
- ❌ `Optimization_Summary.md` (doesn't match title)
- ❌ `perf.md` (doesn't match title)

---

## Article Structure Standards

### 1. Title Format

```markdown
# [Action-Oriented Title]

[Brief introduction - 1-2 sentences explaining the problem and solution]
```

**Examples:**
- ✅ `# Avoid Database Queries in Large Data Loops`
- ✅ `# Fix N+1 Query Problem in JPA/Hibernate`
- ❌ `# Database Queries` (too vague)
- ❌ `# How to Optimize` (not specific enough)

---

### 2. Section Hierarchy

```markdown
## [Main Section]

### [Subsection]

#### [Sub-subsection] (use sparingly)
```

**Rules:**
- Use `##` for main sections (Problem, Solution, Examples)
- Use `###` for subsections
- Avoid `####` unless necessary
- Maximum 3 levels deep

---

### 3. Problem-Solution Pattern

**Standard Structure:**

```markdown
## The Problem

[Describe the scenario and why it's a problem]

### ❌ Bad Practice: [Name]

```java
// Code showing the bad practice
```

**Performance Impact:**
- [Impact 1]
- [Impact 2]
- **[Critical impact in bold]**

### ✅ Good Practice: [Name]

```java
// Code showing the good practice
```

**Performance Impact:**
- [Benefit 1]
- [Benefit 2]
- **[Key benefit in bold]**
```

---

### 4. Code Examples

**Format:**

```markdown
### [Descriptive Title]

```java
// ✅ Good code with comment explaining why
List<Entity> result = repository.selectByIds(ids);

// ❌ Bad code with comment explaining why not
for (Entity e : entities) {
    repository.selectById(e.getId()); // N queries!
}
```
```

**Rules:**
- Always use language identifier (`java`, `sql`, `yaml`, etc.)
- Use `✅` for good practices
- Use `❌` for bad practices
- Add inline comments explaining the code
- Keep examples focused and minimal

---

### 5. Performance Comparison Tables

**Format:**

```markdown
## Performance Comparison

| Approach | Metric 1 | Metric 2 | Metric 3 |
|----------|----------|----------|----------|
| Bad Way | Value | Value | **Critical** |
| Good Way | Value | Value | Normal |
| **Improvement** | **Xx** | **Yx** | **Z%** |
```

**Rules:**
- Always include comparison table when discussing performance
- Use `**bold**` for critical values
- Show improvement multiplier/factor
- Include both quantitative and qualitative metrics

---

### 6. Best Practices Section

**Format:**

```markdown
## Best Practices

### 1. [Practice Name]

```java
// Example code
```

**Explanation:**
- [Why this is important]
- [When to apply]

### 2. [Practice Name]
...
```

**Rules:**
- Number the practices (1, 2, 3...)
- Each practice has: Title + Code + Explanation
- Keep explanations concise (2-3 bullet points)

---

### 7. Common Pitfalls Section

**Format:**

```markdown
## Common Pitfalls to Avoid

### ❌ Pitfall 1: [Pitfall Name]

```java
// Bad code
```

```java
// Good code
```

**Why it's bad:** [Explanation]
```

**Rules:**
- Use `❌ Pitfall N:` format
- Show both bad and good code
- Explain why the bad approach is problematic
- Number pitfalls for easy reference

---

### 8. Advanced Techniques (Optional)

**Format:**

```markdown
## Advanced Techniques

### 1. [Technique Name]

```java
// Advanced example
```

**When to use:** [Scenario]

**Trade-offs:** [Pros and cons]
```

---

### 9. Real-World Case Studies (Optional)

**Format:**

```markdown
## Real-World Case Studies

### Case 1: [Case Name]

**Problem:** [Description]

**Root Cause:** [Analysis]

**Solution:**
1. [Step 1]
2. [Step 2]

**Result:** [Quantitative improvement]
```

---

### 10. Summary Section

**Format:**

```markdown
## Summary

When [scenario]:

1. **[Key point 1]** - [Brief explanation]
2. **[Key point 2]** - [Brief explanation]
3. **[Key point 3]** - [Brief explanation]

**Remember:** [One-sentence takeaway]
```

**Rules:**
- Number the key points
- Bold the key phrase, add brief explanation
- End with memorable "Remember" statement

---

### 11. Quick Checklist (Optional)

**Format:**

```markdown
## Quick Checklist

Before [action]:

- [ ] [Check item 1]
- [ ] [Check item 2]
- [ ] [Check item 3]
```

---

## Writing Style Guidelines

### Language
- Use **English** for all technical articles
- Keep sentences concise and direct
- Use active voice: "Query the database" not "The database is queried"

### Tone
- Professional but accessible
- Focus on practical solutions
- Avoid jargon without explanation

### Formatting
- Use `**bold**` for emphasis on key points
- Use `inline code` for technical terms
- Use emoji sparingly (✅ ❌ ⚠️ only)

### Code Comments
- Explain **why**, not what
- Use `// ✅` for good practices
- Use `// ❌` for bad practices
- Use `// TRIGGER WARNING` for anti-patterns

---

## Article Template

```markdown
# [Action-Oriented Title]

[1-2 sentence introduction]

## The Problem

[Scenario description]

### ❌ Bad Practice: [Name]

```java
// Bad code
```

**Performance Impact:**
- [Impacts]

### ✅ Good Practice: [Name]

```java
// Good code
```

**Performance Impact:**
- [Benefits]

## Implementation Examples

### [Example 1]

```java
// Code
```

## Performance Comparison

| Approach | Metric | Result |
|----------|--------|--------|
| Bad | X | Slow |
| Good | Y | Fast |

## Best Practices

### 1. [Practice]

```java
// Code
```

## Common Pitfalls to Avoid

### ❌ Pitfall 1: [Name]

```java
// Bad
```

```java
// Good
```

## Summary

1. **[Point 1]** - [Explanation]
2. **[Point 2]** - [Explanation]

**Remember:** [Takeaway]
```

---

## Quality Checklist

Before publishing, verify:

- [ ] Title is action-oriented and specific
- [ ] Filename follows naming conventions (lowercase, hyphens, descriptive)
- [ ] Introduction clearly states the problem
- [ ] All code examples have language identifiers
- [ ] Good practices marked with ✅
- [ ] Bad practices marked with ❌
- [ ] Performance comparison table included
- [ ] Summary has numbered key points
- [ ] "Remember" statement is memorable
- [ ] No emoji overuse (only ✅ ❌ ⚠️)
- [ ] All code is syntactically correct
- [ ] Links to related articles (if any)
