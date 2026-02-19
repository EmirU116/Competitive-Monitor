import cron from 'node-cron'
import { prisma } from './db'
import { scrapePage } from './scraper'
import { computeDiff } from './diff'
import { generateChangeSummary } from './ai'

let started = false

export function startScheduler() {
  if (started) return
  started = true

  // Run every hour at :00
  cron.schedule('0 * * * *', async () => {
    console.log('[scheduler] Running hourly scan for all competitors…')

    const competitors = await prisma.competitor.findMany()

    for (const competitor of competitors) {
      let pages: string[]
      try {
        pages = JSON.parse(competitor.pages)
      } catch {
        console.error(`[scheduler] Malformed pages JSON for competitor ${competitor.id}`)
        continue
      }

      for (const pageUrl of pages) {
        try {
          const content = await scrapePage(pageUrl)

          const lastSnapshot = await prisma.snapshot.findFirst({
            where: { competitorId: competitor.id, pageUrl },
            orderBy: { createdAt: 'desc' },
          })

          const newSnapshot = await prisma.snapshot.create({
            data: { competitorId: competitor.id, pageUrl, content },
          })

          if (!lastSnapshot) continue

          const diff = computeDiff(lastSnapshot.content, content)
          if (!diff.hasSignificantChange) continue

          const aiSummary = await generateChangeSummary(
            competitor.name,
            pageUrl,
            diff
          )

          await prisma.change.create({
            data: {
              snapshotId: newSnapshot.id,
              pageUrl,
              diff: diff.rawDiff.slice(0, 10000),
              summary: aiSummary.summary,
              severity: aiSummary.severity,
            },
          })

          console.log(
            `[scheduler] Change detected for ${competitor.name} — ${pageUrl}`
          )
        } catch (err) {
          console.error(`[scheduler] Error scanning ${pageUrl}:`, err)
        }
      }
    }

    console.log('[scheduler] Hourly scan complete.')
  })

  console.log('[scheduler] Hourly scan scheduled.')
}
