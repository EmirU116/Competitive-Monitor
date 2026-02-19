# Repo Branch Workflow Cheatsheet

## Naming Matrix

- `feature/<short-description>` → new functionality
- `fix/<short-description>` → bug fixes
- `chore/<short-description>` → maintenance/refactor/config/deps

## Start Work

```bash
git fetch --all --prune
git checkout main
git pull --ff-only origin main
git checkout -b <type>/<short-description>
```

## Publish Branch

```bash
git push -u origin <type>/<short-description>
```

## Sync With Main

### Rebase style

```bash
git fetch origin
git rebase origin/main
```

### Merge style

```bash
git fetch origin
git merge origin/main
```

## PR Checklist

```bash
npm run lint
npm run build
```

If schema changed:

```bash
npx prisma migrate dev --name <description>
```

## Cleanup After Merge

```bash
git checkout main
git pull --ff-only origin main
git branch -d <type>/<short-description>
git push origin --delete <type>/<short-description>
```

## Recovery

Abort rebase:

```bash
git rebase --abort
```

Abort merge:

```bash
git merge --abort
```

Dangerous discard (confirm first):

```bash
git reset --hard
git clean -fd
```
