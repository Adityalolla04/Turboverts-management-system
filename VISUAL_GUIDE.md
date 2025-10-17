# Git Workflow Visual Guide

## The Journey of Your Code to GitHub

```
┌─────────────────────────────────────────────────────────────────────┐
│                    YOUR CODE'S JOURNEY TO GITHUB                      │
└─────────────────────────────────────────────────────────────────────┘

Step 1: EDIT FILES
┌──────────────────┐
│  Working         │  ← You are here when you edit files
│  Directory       │    Files: modified, new, deleted
│  (Your Computer) │    Status: "Changes not staged for commit"
└──────────────────┘
         │
         │  Command: git add .
         │  or: git add <specific-file>
         ↓
         
Step 2: STAGE CHANGES
┌──────────────────┐
│  Staging Area    │  ← Changes ready to be committed
│  (Index)         │    Files: staged for commit
│                  │    Status: "Changes to be committed"
└──────────────────┘
         │
         │  Command: git commit -m "message"
         │
         ↓

Step 3: COMMIT LOCALLY
┌──────────────────┐
│  Local           │  ← Code saved in your computer
│  Repository      │    Commits exist only on your machine
│  (.git folder)   │    Status: "Your branch is ahead by X commits"
└──────────────────┘
         │
         │  Command: git push origin <branch>
         │
         ↓

Step 4: PUSH TO GITHUB
┌──────────────────┐
│  Remote          │  ← CODE IS NOW ON GITHUB! ✅
│  Repository      │    Visible to everyone
│  (GitHub.com)    │    Status: "Your branch is up to date"
└──────────────────┘
```

## Status Indicators at Each Step

| Step | What You'll See | Next Action |
|------|----------------|-------------|
| **Working Directory** | `Changes not staged for commit` | `git add .` |
| **Staging Area** | `Changes to be committed` | `git commit -m "message"` |
| **Local Repository** | `Your branch is ahead by X commits` | `git push origin <branch>` |
| **Remote Repository** | `Your branch is up to date` | ✅ Done! |

## Quick Visual Check

```
Are my files on GitHub?

START → Run: ./check-github-sync.sh
           │
           ├─→ "UNCOMMITTED changes" ─→ NO ❌ → git add . && git commit
           │
           ├─→ "UNPUSHED commits" ─────→ NO ❌ → git push
           │
           └─→ "REFLECTED in GitHub" ──→ YES ✅ → You're done!
```

## The Three Critical Commands

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  git add    │  →   │ git commit  │  →   │  git push   │
│             │      │             │      │             │
│ Stage your  │      │ Save to     │      │ Upload to   │
│ changes     │      │ local repo  │      │ GitHub      │
└─────────────┘      └─────────────┘      └─────────────┘
   LOCAL ONLY          LOCAL ONLY           → GITHUB ✅
```

## Common Misconceptions

❌ **WRONG:** "I committed, so it's on GitHub"
✅ **RIGHT:** "I committed (local), then pushed, so it's on GitHub"

❌ **WRONG:** "I saved the file, so it's backed up on GitHub"
✅ **RIGHT:** "I saved, added, committed, AND pushed, so it's on GitHub"

## Verification Flowchart

```
                    ┌─────────────────┐
                    │ git status      │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
     ┌────────────┐  ┌────────────┐  ┌────────────┐
     │  Modified  │  │  Staged    │  │   Clean    │
     │   Files    │  │   Files    │  │            │
     └──────┬─────┘  └──────┬─────┘  └──────┬─────┘
            │               │               │
            ▼               ▼               ▼
       git add .      git commit      Check if pushed
                                           │
                              ┌────────────┼────────────┐
                              ▼                         ▼
                     ┌────────────────┐      ┌────────────────┐
                     │ Ahead by X     │      │ Up to date     │
                     │ commits        │      │                │
                     └────────┬───────┘      └────────┬───────┘
                              │                       │
                              ▼                       ▼
                         git push                  ✅ DONE!
                              │
                              ▼
                          ✅ DONE!
```

## File States Diagram

```
    Untracked  →  Unmodified  →  Modified  →  Staged
        │              │            │           │
        │              │            │           │
    (new file)    (committed)   (edited)   (git add)
        │              │            │           │
        └──────────────┴────────────┴───────────┘
                            │
                       git commit
                            │
                            ▼
                      Local Repository
                            │
                       git push
                            │
                            ▼
                    GitHub Repository ✅
```

## Timeline Example

```
Time  │  Your Actions                    │  Git State               │  On GitHub?
──────┼──────────────────────────────────┼─────────────────────────┼────────────
09:00 │ Edit main.py                     │ Modified (working dir)   │ NO ❌
09:05 │ git add main.py                  │ Staged                   │ NO ❌
09:10 │ git commit -m "Fix bug"          │ Committed (local)        │ NO ❌
09:15 │ git push origin main             │ Pushed                   │ YES ✅
```

## Remember

```
╔══════════════════════════════════════════════════════════════╗
║  COMMIT = LOCAL (only on your computer)                      ║
║  PUSH = REMOTE (on GitHub, visible to others)                ║
║                                                              ║
║  To check: Run ./check-github-sync.sh                        ║
╚══════════════════════════════════════════════════════════════╝
```

## Color Legend (in terminal output)

- ✅ Green checkmark = Everything is good
- ⚠️  Yellow warning = Action needed, not critical
- ❌ Red X = Action required immediately

## Quick Reference Commands

```bash
# See current state
git status

# See what's different from GitHub
git diff origin/$(git branch --show-current)

# See unpushed commits
git log origin/$(git branch --show-current)..HEAD

# Push everything
git push origin $(git branch --show-current)

# Or just use our script!
./check-github-sync.sh
```

---

**Pro Tip:** Bookmark this page and refer to it whenever you're unsure about your code's status!
