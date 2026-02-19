# Git Flow Feature Branch Cheatsheet

## Quick Start

```bash
git fetch --all --prune
git checkout develop
git pull --ff-only origin develop
git checkout -b feature/<short-description>
```

## Daily Sync

### Rebase path (preferred)

```bash
git fetch origin
git rebase origin/develop
```

### Merge path

```bash
git fetch origin
git merge origin/develop
```

## Publish Branch

```bash
git push -u origin feature/<short-description>
```

## Finish Branch (after merge)

```bash
git checkout develop
git pull --ff-only origin develop
git branch -d feature/<short-description>
git push origin --delete feature/<short-description>
```

## Useful Inspections

```bash
git status
git branch -vv
git log --oneline --graph --decorate --max-count=25
```

## Recovery Commands

### Abort rebase

```bash
git rebase --abort
```

### Abort merge

```bash
git merge --abort
```

### Undo last commit but keep changes staged

```bash
git reset --soft HEAD~1
```

### Drop local uncommitted changes (dangerous)

```bash
git reset --hard
git clean -fd
```

Use dangerous cleanup commands only after explicit user confirmation.
