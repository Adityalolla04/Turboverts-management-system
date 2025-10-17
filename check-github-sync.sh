#!/bin/bash

# GitHub Code Reflection Checker
# This script helps you verify if your code has been reflected in GitHub

echo "================================================"
echo "GitHub Code Reflection Checker"
echo "================================================"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not a git repository"
    echo "Please run this script from within a git repository"
    exit 1
fi

echo "✓ Running in a git repository"
echo ""

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Current branch: $CURRENT_BRANCH"
echo ""

# Check git status
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Git Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git status
echo ""

# Check for uncommitted changes
UNCOMMITTED=$(git status --porcelain)
if [ -n "$UNCOMMITTED" ]; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo "   Run 'git add .' and 'git commit -m \"message\"' to commit them"
    echo ""
fi

# Check remote
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Remote Repository"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
REMOTE=$(git remote -v | grep fetch | head -n 1)
echo "$REMOTE"
echo ""

# Fetch latest from remote
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Fetching Latest Changes from GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git fetch origin
echo "✓ Fetch complete"
echo ""

# Check if remote branch exists
if git rev-parse --verify origin/$CURRENT_BRANCH > /dev/null 2>&1; then
    REMOTE_EXISTS=true
    echo "✓ Remote branch 'origin/$CURRENT_BRANCH' exists"
else
    REMOTE_EXISTS=false
    echo "❌ Remote branch 'origin/$CURRENT_BRANCH' does NOT exist"
    echo "   This branch hasn't been pushed to GitHub yet"
    echo "   Run: git push -u origin $CURRENT_BRANCH"
fi
echo ""

# Check for unpushed commits
if [ "$REMOTE_EXISTS" = true ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "4. Unpushed Commits (Local commits not on GitHub)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    UNPUSHED=$(git log origin/$CURRENT_BRANCH..HEAD --oneline)
    
    if [ -z "$UNPUSHED" ]; then
        echo "✓ No unpushed commits - All local commits are on GitHub!"
    else
        echo "⚠️  Found unpushed commits:"
        echo "$UNPUSHED"
        echo ""
        UNPUSHED_COUNT=$(echo "$UNPUSHED" | wc -l)
        echo "   Total: $UNPUSHED_COUNT commit(s) need to be pushed"
        echo "   Run: git push origin $CURRENT_BRANCH"
    fi
    echo ""
fi

# Check for unpulled commits
if [ "$REMOTE_EXISTS" = true ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "5. Unpulled Commits (GitHub commits not in local)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    UNPULLED=$(git log HEAD..origin/$CURRENT_BRANCH --oneline)
    
    if [ -z "$UNPULLED" ]; then
        echo "✓ No unpulled commits - Local is up to date with GitHub!"
    else
        echo "⚠️  Found unpulled commits:"
        echo "$UNPULLED"
        echo ""
        UNPULLED_COUNT=$(echo "$UNPULLED" | wc -l)
        echo "   Total: $UNPULLED_COUNT commit(s) need to be pulled"
        echo "   Run: git pull origin $CURRENT_BRANCH"
    fi
    echo ""
fi

# Show recent commits
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. Recent Local Commits (Last 5)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git log --oneline -5
echo ""

if [ "$REMOTE_EXISTS" = true ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "7. Recent Remote Commits (Last 5)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    git log origin/$CURRENT_BRANCH --oneline -5
    echo ""
fi

# Final summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$UNCOMMITTED" ]; then
    echo "❌ Status: You have UNCOMMITTED changes"
    echo "   Action: Commit your changes first"
elif [ "$REMOTE_EXISTS" = false ]; then
    echo "❌ Status: Branch NOT on GitHub"
    echo "   Action: git push -u origin $CURRENT_BRANCH"
elif [ -n "$UNPUSHED" ]; then
    echo "⚠️  Status: You have UNPUSHED commits"
    echo "   Action: git push origin $CURRENT_BRANCH"
else
    echo "✓ Status: All your code is REFLECTED in GitHub!"
    echo "   Your local repository is in sync with GitHub"
fi

echo ""
echo "Repository URL: $(git config --get remote.origin.url)"
echo "View on GitHub: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/' | sed 's/.*github.com[:/]\(.*\)/\1/')"
echo ""
echo "================================================"
