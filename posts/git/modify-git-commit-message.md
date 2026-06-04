# How to Modify Git Commit Messages

Git provides two ways to modify commit messages, depending on the scenario. Here's a complete guide:

---

## 一、Most Common: Modify the **Last** Commit Message

**Use case**: Just committed, noticed a typo in the message, **haven't pushed to remote yet**.

### Command
```bash
git commit --amend
```

### Steps
1. Run the command, and Git will open your default editor
2. Modify the first line (the commit message)
3. Save and exit
   - **Vim**: Press `i` to edit → make changes → press `Esc` → type `:wq` and Enter

### One-liner (skip editor)
```bash
git commit --amend -m "New commit message"
```

---

## 二、Advanced: Modify **Historical** Commit Messages

**Use case**: Need to modify a commit that's not the most recent one.

### Steps
1. View commit history to find the **parent commit hash** of the target commit:
   ```bash
   git log
   ```
2. Run interactive rebase (replace `commit-id` with the parent hash):
   ```bash
   git rebase -i commit-id
   ```
3. In the editor, change `pick` to `reword` for the commits you want to modify
4. Save and exit, Git will prompt you to edit each marked commit's message
5. Rebase completes automatically when done

---

## ⚠️ Important Warnings (Must Read)

### 1. If commit has already been pushed to remote
- You must **force push** to overwrite:
  ```bash
  git push --force-with-lease
  ```
- **NEVER force push on public/team branches** - it will overwrite others' work!

### 2. Best Practices
- Only modify history on **your private branch** that hasn't been pulled by others
- Use `--force-with-lease` instead of `--force` for safer force pushes

---

## Bonus: Modify Commit Author

Change author info without editing the message:
```bash
git commit --amend --author="Shing Rui <sunquakes@outlook.com>" --no-edit
```

For historical commits, use interactive rebase with `edit` instead of `reword`, then:
```bash
git commit --amend --author="New Author <new.email@example.com>" --no-edit
git rebase --continue
```

---

### Summary
| Scenario | Command |
|----------|---------|
| Modify last commit | `git commit --amend` |
| Modify historical commits | `git rebase -i <parent-commit-id>` |
| Force push after modification | `git push --force-with-lease` (private branches only) |
| Change commit author | `git commit --amend --author="Name <email>"` |

---

**Remember**: Rewriting Git history is powerful but dangerous. Always be cautious when modifying commits that have been shared with others.