# Quick Troubleshooting Cheatsheet

## 🎯 Quick Answer: "Is my code on GitHub?"

Run this ONE command:
```bash
./check-github-sync.sh
```

OR manually check:
```bash
git log origin/$(git branch --show-current)..HEAD
```
- **No output** = Code is on GitHub ✅
- **Shows commits** = Code NOT on GitHub ❌

---

## 🚀 Common Fixes

### Fix 1: Push Your Code
```bash
git push origin $(git branch --show-current)
```

### Fix 2: Commit and Push
```bash
git add .
git commit -m "Your message here"
git push origin $(git branch --show-current)
```

### Fix 3: First Time Push (New Branch)
```bash
git push -u origin $(git branch --show-current)
```

### Fix 4: Pull Before Push
```bash
git pull origin $(git branch --show-current)
git push origin $(git branch --show-current)
```

---

## 📊 Status Indicators

| What You See | What It Means | What To Do |
|-------------|---------------|------------|
| `working tree clean` | No uncommitted changes | ✅ Good |
| `nothing to commit` | All changes committed | ✅ Good |
| `Your branch is up to date` | In sync with GitHub | ✅ Good |
| `Your branch is ahead by X commits` | You have unpushed commits | 🔧 Push your code |
| `Changes not staged` | You have uncommitted changes | 🔧 Commit and push |
| `Untracked files` | New files not added | 🔧 Add, commit, and push |
| `Your branch is behind` | GitHub has newer commits | 🔧 Pull changes |
| `diverged` | Both local and remote have different commits | 🔧 Pull with rebase |

---

## 🔍 Quick Checks

### Check 1: What's my current branch?
```bash
git branch --show-current
```

### Check 2: What's changed?
```bash
git status
```

### Check 3: What did I commit?
```bash
git log --oneline -5
```

### Check 4: What's on GitHub?
```bash
git log origin/$(git branch --show-current) --oneline -5
```

### Check 5: Difference between local and GitHub?
```bash
git diff origin/$(git branch --show-current)..HEAD
```

---

## ⚡ Emergency Commands

### Undo Last Commit (keep changes)
```bash
git reset --soft HEAD~1
```

### Discard All Local Changes
```bash
git reset --hard HEAD
```

### See What Will Be Pushed
```bash
git diff --stat origin/$(git branch --show-current)..HEAD
```

### Force Fetch Latest
```bash
git fetch origin --prune
```

---

## 🎓 Understanding Git States

```
Working Directory → Staging Area → Local Repository → Remote Repository (GitHub)
     (files)     →   (git add)   →  (git commit)   →     (git push)
```

Your code is only visible on GitHub after **ALL** these steps!

---

## 💡 Pro Tips

1. **Always check before asking**: Run `./check-github-sync.sh`
2. **Commit often**: Small commits are easier to manage
3. **Push regularly**: Don't accumulate too many local commits
4. **Pull before push**: Avoid conflicts by staying updated
5. **Use meaningful messages**: Future you will thank you

---

## 📱 One-Liner Status Check

```bash
echo "Branch: $(git branch --show-current) | Status: $(git status -s | wc -l) files changed | Unpushed: $(git log origin/$(git branch --show-current)..HEAD --oneline 2>/dev/null | wc -l) commits"
```

---

## 🆘 Still Stuck?

1. Read: `GITHUB_CODE_REFLECTION_GUIDE.md` for detailed explanations
2. Run: `./check-github-sync.sh` for automated diagnosis
3. Check: GitHub repository website directly
4. Ask: With the output of `git status` and `git log --oneline -5`

---

## 📞 Quick Reference URLs

- Your repo: `https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')`
- Git docs: https://git-scm.com/doc
- GitHub guides: https://guides.github.com/

---

**Remember**: Committing ≠ Pushing. You must PUSH to see code on GitHub! 🚀
