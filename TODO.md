# CompetitorWatch — Project TODO

## Current Status
Core MVP is complete and running. The app monitors competitor websites, detects content changes via diff, and generates AI-powered summaries with severity ratings. The scheduler runs hourly automatically on server start.

## Completed
- [x] Project scaffolding (Next.js App Router, Prisma/SQLite, Tailwind CSS v4)
- [x] Playwright headless scraper (`lib/scraper.ts`)
- [x] Diff engine with 2% significance threshold (`lib/diff.ts`)
- [x] Claude AI change summarization with severity rating (`lib/ai.ts`)
- [x] Hourly cron scheduler via node-cron (`lib/scheduler.ts` + `instrumentation.ts`)
- [x] Competitors CRUD API
- [x] Manual scan API per competitor (`POST /api/scan`)
- [x] Scan All API (`POST /api/scan/all`)
- [x] Changes feed API (`GET /api/changes`)
- [x] Dashboard with competitor cards, stats, and recent changes feed
- [x] Competitor detail page with change timeline
- [x] Add Competitor form
- [x] GitHub remote setup
- [x] Professional UI redesign (sidebar layout, stats row, polished cards)

## In Progress
- [ ] End-to-end scan testing (verifying scrape → diff → AI summary flow works)

## Backlog

### High Priority
- [ ] Store `keyChanges` array from AI response in the database and display as bullet points on ChangeItem
- [ ] Delete cascades: deleting a competitor should also delete its snapshots and changes (currently may error if Prisma doesn't cascade)
- [ ] Email or Slack notification when a high/medium severity change is detected
- [ ] Scan All progress feedback (show per-competitor progress, not just a spinner)

### Medium Priority
- [ ] Competitor edit page (update name, URL, monitored pages list)
- [ ] Filter/search on the changes feed (by competitor, severity, date range)
- [ ] Pagination for changes feed (currently hard-capped at 50)
- [ ] Diff view: expandable modal or drawer showing the raw diff for a change
- [ ] Rate limiting on scan endpoints to prevent runaway scraping

### Low Priority / Nice to Have
- [ ] Export changes to CSV
- [ ] Mobile-responsive layout (hamburger menu for sidebar)
- [ ] Dark mode
- [ ] Webhook support for custom integrations (POST to a URL when changes are detected)
- [ ] Change count badge on CompetitorCard in the dashboard

## Notes
- The AI returns `keyChanges[]` but they are currently discarded — only `summary` and `severity` are stored. Schema change + migration needed to fix this.
- SQLite `DATABASE_URL="file:./dev.db"` resolves relative to `prisma/schema.prisma`, so the DB lives at `prisma/dev.db`.
- The `.env` file contains the live API key — consider moving secrets to `.env.local` (gitignored) before sharing the repo publicly.
