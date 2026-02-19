# Competitive Monitor

A web application that automatically tracks competitor websites for changes and delivers AI-powered summaries of what changed and why it matters.

## The Problem

Keeping tabs on competitors is tedious and time-consuming. Important changes — pricing updates, new features, messaging shifts, product launches — can happen at any time across dozens of pages. Manually checking those pages every day is not realistic, and by the time a team notices a meaningful change, the window to respond has often already closed.

Most teams either rely on ad-hoc checks (inconsistent and easy to miss) or expensive enterprise tools that do far more than needed and cost accordingly.

## What This Solves

Competitive Monitor gives you a lightweight, self-hosted system that does three things automatically:

1. **Scrapes** the pages you care about on a schedule using Playwright
2. **Detects** what actually changed by diffing each new snapshot against the previous one
3. **Summarizes** the meaningful differences in plain English using Claude AI, including a severity rating so you know what to prioritize

Instead of reading through raw page diffs, you get a clear answer: *what changed, and does it matter?*

## Why Use This

- **Proactive intelligence** — changes surface to you instead of you having to go looking
- **AI context, not just diffs** — Claude interprets the change and flags whether it's a minor copy edit or a major strategic shift
- **Self-hosted** — your competitor data stays in your own database, not a third-party SaaS
- **Focused scope** — monitors exactly the URLs you add, nothing more
- **Low overhead** — runs on SQLite and a single Next.js server; no external queue or worker infrastructure needed

## Tech Stack

- **Next.js** (App Router) — frontend and API routes
- **Playwright** — headless browser scraping
- **Prisma + SQLite** — local database for competitors, snapshots, and changes
- **node-cron** — scheduled scraping jobs
- **Claude AI** (`@anthropic-ai/sdk`) — change summarization and severity classification
- **Tailwind CSS v4** — styling

## Getting Started

### 1. Install dependencies

```bash
npm install
npx playwright install chromium
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in the values:

```
DATABASE_URL="file:./prisma/dev.db"
ANTHROPIC_API_KEY="your-api-key-here"
```

### 3. Set up the database

```bash
npx prisma migrate dev
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. Add a **Competitor** with one or more page URLs to monitor
2. The app scrapes each URL on a schedule and stores a **Snapshot** of the page text
3. Each new snapshot is diffed against the previous one
4. If a meaningful diff is found, it is sent to Claude, which returns a plain-English **Change** summary and a severity rating (low / medium / high)
5. All changes are visible in the dashboard, sorted and filterable by severity and date

## Project Structure

```
app/          — Next.js App Router pages and API routes
components/   — React UI components
lib/          — Scraper, diff logic, Claude integration, cron scheduler
prisma/       — Database schema and migrations
```

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
npx prisma studio  # Open database GUI
```
