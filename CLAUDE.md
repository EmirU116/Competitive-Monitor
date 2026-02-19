# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Build for production
npm run lint       # Run ESLint

# Database
npx prisma migrate dev     # Apply schema changes and regenerate client
npx prisma generate        # Regenerate Prisma client after schema edits
npx prisma studio          # Open GUI to inspect/edit the SQLite database
npx prisma db push         # Push schema changes without creating a migration
```

## Environment Setup

Copy `.env.example` to `.env.local` and fill in:
- `DATABASE_URL` — SQLite file path (e.g. `file:./prisma/dev.db`)
- `ANTHROPIC_API_KEY` — Required for Claude AI change summaries

## Architecture

This is a **Next.js App Router** application that monitors competitor websites for changes and summarizes them with Claude AI.

**Core data flow:**
1. `Competitor` records store a list of page URLs to monitor
2. A scheduled job (node-cron) uses **Playwright** to scrape each page and store a `Snapshot` of its text content
3. New snapshots are diffed against the previous snapshot using the **diff** library
4. Meaningful diffs are sent to **Claude** (`@anthropic-ai/sdk`) to produce a human-readable summary with a severity rating
5. Results are stored as `Change` records linked to the snapshot

**Database:** SQLite via Prisma. Schema is in `prisma/schema.prisma`. The three models are `Competitor → Snapshot → Change`.

**Path alias:** `@/*` resolves to the project root.

**Styling:** Tailwind CSS v4 (configured via PostCSS).

## Git Workflow

**Branch naming:**
- `feature/<short-description>` — new functionality
- `fix/<short-description>` — bug fixes
- `chore/<short-description>` — non-functional changes (deps, config, refactor)

**Feature workflow:**
```bash
git checkout main && git pull          # always branch from up-to-date main
git checkout -b feature/my-feature

# ... do work, commit often ...

git push -u origin feature/my-feature
# open a PR into main; never commit directly to main
```

**Commit messages:** Use the imperative mood and keep the subject under 72 characters.
```
Add Playwright scraper for competitor pages
Fix cron job not running after server restart
```

**Before merging a PR:**
- `npm run lint` passes
- `npm run build` succeeds (catches TypeScript errors)
- Prisma schema changes include a migration (`npx prisma migrate dev --name <description>`)
