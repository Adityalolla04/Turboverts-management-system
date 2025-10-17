# GitHub Code Reflection Guide

## Overview
This guide helps you verify whether your locally committed code has been successfully pushed and reflected in the GitHub repository.

## Prerequisites
- Git installed on your system
- Access to your GitHub repository
- Code committed locally

## Steps to Check if Your Code is Reflected in GitHub

### 1. Check Git Status
First, verify the current state of your local repository:

```bash
git status
```

**What to look for:**
- `nothing to commit, working tree clean` - All changes are committed
- `Your branch is ahead of 'origin/[branch-name]' by X commits` - You have unpushed commits
- `Your branch is up to date with 'origin/[branch-name]'` - Your local branch matches the remote

### 2. Check for Unpushed Commits
See if you have commits that haven't been pushed to GitHub:

```bash
git log origin/[branch-name]..HEAD
```

Replace `[branch-name]` with your current branch (e.g., `main`, `master`, or your feature branch).

**Interpretation:**
- **Output shows commits**: These commits are NOT yet on GitHub
- **No output**: All commits are pushed to GitHub

### 3. View Your Current Branch
Identify which branch you're working on:

```bash
git branch
```

The branch with an asterisk (*) is your current branch.

### 4. Compare Local and Remote
Check the difference between your local and remote repository:

```bash
git fetch origin
git log HEAD..origin/[branch-name]
```

**Interpretation:**
- **Output shows commits**: Remote has commits you don't have locally
- **No output**: Your local is up to date with remote

### 5. Push Your Code
If you have unpushed commits, push them to GitHub:

```bash
git push origin [branch-name]
```

For the first push of a new branch:
```bash
git push -u origin [branch-name]
```

### 6. Verify on GitHub Website
After pushing, verify on GitHub:

1. Go to your repository URL: `https://github.com/[username]/[repository-name]`
2. Check the branch dropdown to ensure your branch exists
3. Navigate to the "Commits" page to see your recent commits
4. Click on your latest commit to view the changes

## Common Scenarios and Solutions

### Scenario 1: Code Committed but Not Pushed
**Symptoms:**
```
Your branch is ahead of 'origin/main' by 2 commits
```

**Solution:**
```bash
git push origin [branch-name]
```

### Scenario 2: No Remote Branch Set
**Symptoms:**
```
fatal: The current branch [branch-name] has no upstream branch
```

**Solution:**
```bash
git push -u origin [branch-name]
```

### Scenario 3: Changes Made but Not Committed
**Symptoms:**
```
Changes not staged for commit:
  modified: file.txt
```

**Solution:**
```bash
git add .
git commit -m "Your commit message"
git push origin [branch-name]
```

### Scenario 4: Diverged Branches
**Symptoms:**
```
Your branch and 'origin/main' have diverged
```

**Solution:**
```bash
git pull origin [branch-name] --rebase
# Resolve any conflicts if they arise
git push origin [branch-name]
```

## Quick Command Reference

| Task | Command |
|------|---------|
| Check status | `git status` |
| View local commits | `git log --oneline -10` |
| View remote commits | `git log origin/[branch] --oneline -10` |
| Check unpushed commits | `git log origin/[branch]..HEAD` |
| Push to GitHub | `git push origin [branch]` |
| Fetch latest from GitHub | `git fetch origin` |
| Pull latest changes | `git pull origin [branch]` |
| View remotes | `git remote -v` |
| View all branches | `git branch -a` |

## Verification Checklist

- [ ] Run `git status` - working tree should be clean
- [ ] Run `git log origin/[branch]..HEAD` - should show no output if all commits are pushed
- [ ] Check GitHub repository website - latest commit should match your local commit
- [ ] Verify branch exists on GitHub (check branch dropdown on GitHub)
- [ ] Check commit history on GitHub matches your local history

## Troubleshooting

### Problem: Permission Denied
**Error:**
```
Permission denied (publickey)
```

**Solution:**
1. Verify your SSH keys are set up correctly
2. Or use HTTPS URL with personal access token
3. Check: `git remote -v` to see your remote URL

### Problem: Rejected Push
**Error:**
```
! [rejected] main -> main (fetch first)
```

**Solution:**
```bash
git pull origin [branch-name]
# Resolve any merge conflicts
git push origin [branch-name]
```

### Problem: Can't Find Branch on GitHub
**Possible Reasons:**
1. Branch name mismatch - check with `git branch -a`
2. Branch not pushed yet - push with `git push origin [branch-name]`
3. Looking at wrong repository - verify with `git remote -v`

## Best Practices

1. **Always check status before committing:**
   ```bash
   git status
   ```

2. **Review your changes before pushing:**
   ```bash
   git log --oneline -5
   git diff origin/[branch]..HEAD
   ```

3. **Keep your local branch updated:**
   ```bash
   git fetch origin
   git pull origin [branch-name]
   ```

4. **Use meaningful commit messages:**
   ```bash
   git commit -m "Add feature: brief description of changes"
   ```

5. **Push regularly:**
   - Don't let commits pile up locally
   - Push after completing a logical unit of work

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

## Summary

To ensure your code is reflected in GitHub:
1. Commit your changes locally
2. Check for unpushed commits
3. Push to the remote repository
4. Verify on GitHub website

Remember: **Committing is local, Pushing is remote!**
