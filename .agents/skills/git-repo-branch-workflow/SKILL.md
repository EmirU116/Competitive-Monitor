---
name: git-repo-branch-workflow
description: Use this skill for repositories that branch from main and use feature/fix/chore branch prefixes, including safe branch creation, PR prep, merge checks, and branch cleanup.
---

# Git Branch Workflow (Repo Conventions)

Use this skill for repositories that follow:

- Base branch: `main`
- Branch naming: `feature/<short-description>`, `fix/<short-description>`, `chore/<short-description>`
- Pull requests target: `main`
- Never commit directly to `main`

## When to Use This Skill

Use this skill when the user asks to:

- Start a new branch for feature, fix, or chore work
- Sync branch with latest `main`
- Prepare and validate a PR
- Merge and clean up branches safely
- Apply branch naming conventions consistently

## Branch Type Selection

Choose branch prefix by intent:

- `feature/` for new user-facing or product functionality
- `fix/` for bug fixes and regressions
- `chore/` for non-functional maintenance (deps, config, refactor)

If unclear, ask one short clarification question before creating the branch.

## Safe Default Workflow

### 1) Pre-flight

```bash
git status
git fetch --all --prune
```

If there are uncommitted changes, commit or stash before switching base branches.

### 2) Create branch from updated main

```bash
git checkout main
git pull --ff-only origin main
git checkout -b <type>/<short-description>
```

Use kebab-case for `<short-description>`.

### 3) Push and track

```bash
git push -u origin <type>/<short-description>
```

### 4) Keep branch current

Preferred on private branch:

```bash
git fetch origin
git rebase origin/main
```

Alternative for shared branch policy:

```bash
git fetch origin
git merge origin/main
```

### 5) PR preparation checks

Before opening or merging PR:

```bash
npm run lint
npm run build
```

If Prisma schema changed, ensure migration exists:

```bash
npx prisma migrate dev --name <description>
```

PR target is `main`.

### 6) Post-merge cleanup

```bash
git checkout main
git pull --ff-only origin main
git branch -d <type>/<short-description>
git push origin --delete <type>/<short-description>
```

## Commit Message Guidance

- Use imperative mood
- Keep subject line under 72 characters

Examples:

- `Add competitor scan retry logic`
- `Fix snapshot diff edge case`
- `Refactor scheduler startup wiring`

## Safety Rules

- Explain any destructive command (`-D`, `reset --hard`, force-push) before running it
- Prefer `--ff-only` pulls on `main`
- Do not rewrite shared history unless user confirms team coordination

## Reference

For quick commands, naming matrix, and common recoveries, read:

- `references/repo-branch-cheatsheet.md`
