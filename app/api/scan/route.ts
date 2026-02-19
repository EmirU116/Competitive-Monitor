import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { scrapePage } from '@/lib/scraper'
import { computeDiff } from '@/lib/diff'
import { generateChangeSummary } from '@/lib/ai'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { competitorId } = body

  if (!competitorId) {
    return NextResponse.json({ error: 'competitorId is required' }, { status: 400 })
  }

  const competitor = await prisma.competitor.findUnique({
    where: { id: competitorId },
  })

  if (!competitor) {
    return NextResponse.json({ error: 'Competitor not found' }, { status: 404 })
  }

  const pages: string[] = JSON.parse(competitor.pages)
  const results: { pageUrl: string; status: string; changeDetected?: boolean }[] = []

  for (const pageUrl of pages) {
    try {
      // Scrape current content
      const content = await scrapePage(pageUrl)

      // Get the last snapshot for this page
      const lastSnapshot = await prisma.snapshot.findFirst({
        where: { competitorId, pageUrl },
        orderBy: { createdAt: 'desc' },
      })

      // Save new snapshot
      const newSnapshot = await prisma.snapshot.create({
        data: { competitorId, pageUrl, content },
      })

      if (!lastSnapshot) {
        // First scan — no diff yet
        results.push({ pageUrl, status: 'first_scan' })
        continue
      }

      // Compute diff
      const diff = computeDiff(lastSnapshot.content, content)

      if (!diff.hasSignificantChange) {
        results.push({ pageUrl, status: 'no_change' })
        continue
      }

      // Generate AI summary
      const aiSummary = await generateChangeSummary(competitor.name, pageUrl, diff)

      // Save change
      await prisma.change.create({
        data: {
          snapshotId: newSnapshot.id,
          pageUrl,
          diff: diff.rawDiff.slice(0, 10000), // cap stored diff size
          summary: aiSummary.summary,
          severity: aiSummary.severity,
        },
      })

      results.push({ pageUrl, status: 'change_detected', changeDetected: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      results.push({ pageUrl, status: `error: ${msg}` })
    }
  }

  return NextResponse.json({ competitorId, results })
}
