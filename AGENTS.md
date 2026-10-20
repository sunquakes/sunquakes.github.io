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

### Keep the Filename Consistent with the Content

**If the title or content changes, rename the file so the filename stays consistent with it.**

- Do NOT keep working or placeholder names once the final title is known
- The filename drives the generated nav/sidebar link, so a stale name results in an incorrect link

**Example:**
- ❌ `idea-to-a-product.md` (placeholder, does not match the post content)
- ✅ `anyone-can-be-a-full-stack-developer.md`

### Keep Filenames Short

**Prefer a short filename (roughly 60 characters or fewer) that still captures the post content.**

- Don't copy a long title verbatim — summarize its core idea
- Long filenames are hard to read and produce unwieldy URLs

**Example:**
- ❌ `anyone-can-be-a-full-stack-developer-now-cli-skill-become-a-programmer-without-writing-code.md` (too long)
- ✅ `anyone-can-be-a-full-stack-developer.md`

---

## Frontmatter Description

**Every content page MUST keep its frontmatter `description` in sync with the page content.**

- The `description` is rendered into `<meta name="description">`, so it drives search results and link previews
- Whenever the visible content of a page changes (sections added, removed, or rewritten), update the `description` in the same change
- Describe what the page actually offers now — do not keep outdated wording about anything that was removed
- Keep it to a single sentence of roughly 120–160 characters, written in the same language as the page
- Base it only on content that exists on the page — never invent services, prices, or claims

**Example:**
- ❌ `description: Web and mobile app development.` (generic, and stale once new services were added)
- ✅ `description: "Fixed-price custom software: web apps, backend APIs, AI automation, 3D and GIS development — scoped and priced in writing before any work starts."`

**Note:** Quote the value when it contains `: `, `#`, or other YAML-special characters.

---

## Service Consistency

**`services/index.md` is the single source of truth for what is offered.**

- Every page — Home, Projects, Contact, nav, and meta descriptions — must describe only services that are actually listed on the Services page. Never invent a service, price, or capability
- When a service is added, renamed, or removed on the Services page, update every page that lists or summarises services in the same change
- The Home feature cards MUST mirror the primary service categories on the Services page (the H3 sections under "Full Service List"), reusing the same naming and scope. Benefit-driven wording is fine, but the scope must trace back to a listed service
- Supplementary items (cloud deployment, documentation, training) live under "Additional Implementation Services" and are not given their own Home card
- Every other place that lists or offers a service — the Contact page's "What do you need?" dropdown and any select/form field, CTA copy, nav labels, and meta descriptions — MUST enumerate the same primary service categories, in the same order, with the same names or a clear paraphrase. Add a single catch-all option at the end (e.g. "Something else") rather than inventing extra services
- Treat form dropdowns as service lists, not free-form UI: when a service is added, renamed, or removed on the Services page, update the form options in the same change

**Example:**
- ❌ Home shows a "Backend & API Development" card, but the Services page only offers backend APIs as part of "Custom Business Software Solutions"
- ❌ The Contact "What do you need?" dropdown offers "Game development" and "Server maintenance", which are not listed on the Services page
- ✅ Home and Services both present the same categories: Custom Business Software, AI Business Automation, 3D Interactive Experiences, and GIS & Map Solutions
- ✅ The Contact dropdown offers one option per Services page section — Custom business software, AI business automation, 3D interactive experiences, GIS &amp; map solutions, and Deployment/documentation/training — plus "Something else"

---

## Clients & Logo Consistency

**`clients-cases/index.md` is the single source of truth for client claims.**

- List only companies the owner has actually delivered work for. Never invent a client, and never add a company's logo to imply a relationship that does not exist
- Display **official brand marks only** — download them from the client's own website or brand/CDN and store them under `public/assets/clients/`. Never redraw, recolor, crop, or AI-generate a third-party logo
- Reference a logo as `/assets/clients/<file>` with descriptive `alt` text (e.g. `alt="Haier logo"`)
- Use the exact public brand name. Add a country or entity qualifier only when it identifies the real contracting entity (e.g. `Haier Thailand`)
- Never publish a client's commercial details — contract size, rates, timelines, or internal metrics — unless the client has agreed to it
- Never name a client who is under NDA. Describe that work by capability and sector only — no name, no logo, no detail specific enough to identify the client — and say the details are available on a call. Anonymised claims must still trace to real work
- Case studies are titled by capability and stay **unattributed** until the owner confirms which engagement belongs to which client

**Markup:** render clients in the `pf-grid pf-grid-3` grid — three per row, collapsing to two below 960px and one below 640px:

```html
<div class="pf-grid pf-grid-3">
  <div class="pf-card">
    <div class="pf-client-logo">
      <img src="/assets/clients/haier.png" alt="Haier logo" loading="lazy" />
    </div>
    <h3>Haier Thailand</h3>
  </div>
</div>
```

To signal that more clients exist without naming them, use the `pf-nda` block — a bordered note with a `.pf-nda` heading, a short explanation and a `pf-btn` link to the contact page. List the withheld engagements as capability plus sector, never as a named or identifiable client.

- `.pf-client-logo` keeps a white tile behind the mark so dark or transparent logos stay legible in both light and dark themes. Do not remove it
- When a client is added, renamed, or removed, update the `description` in `clients-cases/index.md` in the same change

**Example:**
- ❌ Adding "Acme Corp" with a logo pulled from a random search result, because the page looks sparse
- ❌ Redrawing a client's wordmark as inline SVG to match the site palette
- ❌ Writing "cut their export time by 60%" for a client that never approved that number
- ✅ Adding a client only after the engagement is real, using the official mark downloaded from their own site, with the name matching their own branding

---

## Case Study Pages

**Case detail pages are flat files, not folders.**

- Each case lives at `clients-cases/<case-name>.md` — never `clients-cases/<case-name>/index.md`
- Each card's `data-case-study` must be `/clients-cases/<case-name>` — no trailing slash, no `.html`; the content loader strips `.html` so the popup's exact-match lookup succeeds
- The listing page `clients-cases/index.md` must stay out of the popup payload

**A case has exactly one cover image, shared by every surface.**

- The home page card, the Clients & Cases grid card and the detail page must all point at the same local file under `public/assets/clients-cases/`
- Never reference an external image URL (the generation API, a CDN, a stock site) from a page — download or author the asset and commit it to the repo
- Use the same `alt` text on all three surfaces, describing what the image actually shows rather than the service offered
- When a cover is replaced, swap the file in place or update all three references in the same change; remove the old file so unused assets don't linger
- Prefer a vector `.svg` cover when the image is an illustrated mockup — it stays sharp at card and detail-page sizes

**Prefer a real cover source; illustrate it only when there is none.**

- If a real source exists — a screenshot, or a frame captured from a supplied video or recording — use it. Capture the frame, commit it under `public/assets/clients-cases/`, and crop it to 16:9 so it lines up with the sibling covers
- If no real source exists, create an illustration that matches the case — a vector `.svg` mockup of the case's own subject. Do not fabricate a photorealistic screenshot of software that does not exist
- Whichever route is taken, the result still follows the cover rule above: one local file, one `alt` text, shared by every surface, with unused assets removed

**If a case is a video, the detail page contains only the video.**

- A video case page shows exactly: the page title, the `<video>` block and the back link — nothing else
- No intro paragraph and no text sections (challenge, result, write-up) on a video case page
- Image-based case pages follow the normal structure: intro, media, The challenge, Result

**An image case has exactly two sections: The challenge and Result.**

- Every image case page is: intro paragraph, cover media, `## The challenge`, then `## Result` — nothing in between
- Never add a "What we built" or feature-list section — the case states the problem and the outcome, not an inventory of features
- `## The challenge` lists the concrete problems in the client's situation; `## Result` lists what changed, each point traceable to a challenge above
- Keep the intro to one short paragraph and finish with the `← Back to Clients & Cases` `pf-btn` link

**The home page features exactly three cases.**

- `clients-cases/index.md` lists **every** case; the home page (`index.md`) shows only **three**, as a curated selection
- Never let the home page grow past three case cards — when a case is added, swap one out rather than appending
- Keep the trio spread across different service categories, and reuse the same cover (image or video) and the same `data-case-study` path as the listing page
- When a case is added, renamed, or removed, update the home page trio in the same change

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
