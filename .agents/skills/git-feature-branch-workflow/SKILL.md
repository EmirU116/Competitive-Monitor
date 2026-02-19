---
name: git-feature-branch-workflow
description: Use this skill when users ask to create, manage, sync, merge, or clean up Git feature branches using Git Flow conventions (feature/* from develop), including safe branch handling and PR preparation.
---

# Git Feature Branch Workflow (Git Flow)

Use this skill to handle feature branch lifecycle tasks safely and consistently in repositories that use Git Flow.

## When to Use This Skill

Use this skill when the user asks to:

- Create a new feature branch
- Rename or clean up feature branches
- Sync a feature branch with `develop`
- Prepare a PR for a feature branch
- Finish a feature branch and merge it back
- Recover from common branch mistakes (wrong base, stale branch, uncommitted changes)

## Branching Standard

- Base branch for features: `develop`
- Feature branch naming: `feature/<short-description>`
- Keep feature branches short-lived and focused on one change
- Merge back into `develop` through PR unless user explicitly requests otherwise

## Safe Workflow

### 1) Pre-flight checks

Run these checks before branch operations:

```bash
git status
git remote -v
git fetch --all --prune
```

If working tree is dirty, either:

- Commit current changes, or
- Stash with `git stash push -u -m "wip before branch op"`

### 2) Create a feature branch

```bash
git checkout develop
git pull --ff-only origin develop
git checkout -b feature/<short-description>
```

If branch name is ambiguous, propose a concise kebab-case option.

### 3) Keep feature branch up to date

Preferred for clean history:

```bash
git fetch origin
git rebase origin/develop
```

If team policy avoids rebase on shared branches, use:

```bash
git fetch origin
git merge origin/develop
```

After resolving conflicts:

```bash
git add <resolved-files>
git rebase --continue
```

or finish merge with commit when using merge strategy.

### 4) Push and open PR

```bash
git push -u origin feature/<short-description>
```

PR target should be `develop` by default.

Before PR, verify:

- Branch includes only intended commits
- Tests/lint/build pass for changed scope
- PR title and description summarize user-visible impact

### 5) Finish feature branch

After PR merge:

```bash
git checkout develop
git pull --ff-only origin develop
git branch -d feature/<short-description>
git push origin --delete feature/<short-description>
```

If local branch is not fully merged but user confirms deletion is intended, use `-D`.

## Common Recovery Patterns

### Wrong base branch

If a feature was started from `main` accidentally:

1. Identify divergence with `git log --oneline --graph --decorate --all`
2. Rebase or cherry-pick onto `develop` based on branch state
3. Force-push only when branch is private or user confirms coordination

### Stale local refs

```bash
git fetch --all --prune
```

### Branch rename

```bash
git branch -m feature/<old-name> feature/<new-name>
git push origin -u feature/<new-name>
git push origin --delete feature/<old-name>
```

## Communication Defaults

When performing branch operations for the user:

- State the exact base branch and target branch
- Explain destructive commands (`-D`, force-push) before running them
- Prefer safest command first, then offer riskier fallback

## Reference

For quick command lookup and decision shortcuts, read:

- `references/git-flow-cheatsheet.md`
