import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { scrapePage } from '@/lib/scraper'
import { computeDiff } from '@/lib/diff'
import { generateChangeSummary } from '@/lib/ai'

export const maxDuration = 300

export async function POST() {
  const competitors = await prisma.competitor.findMany()

  const results: {
    competitorId: string
    competitorName: string
    pages: { pageUrl: string; status: string; changeDetected?: boolean }[]
  }[] = []

  for (const competitor of competitors) {
    let pages: string[]
    try {
      pages = JSON.parse(competitor.pages)
    } catch {
      results.push({ competitorId: competitor.id, competitorName: competitor.name, pages: [{ pageUrl: '', status: 'error: malformed pages data' }] })
      continue
    }
    const pageResults: { pageUrl: string; status: string; changeDetected?: boolean }[] = []

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

        if (!lastSnapshot) {
          pageResults.push({ pageUrl, status: 'first_scan' })
          continue
        }

        const diff = computeDiff(lastSnapshot.content, content)

        if (!diff.hasSignificantChange) {
          pageResults.push({ pageUrl, status: 'no_change' })
          continue
        }

        const aiSummary = await generateChangeSummary(competitor.name, pageUrl, diff)

        await prisma.change.create({
          data: {
            snapshotId: newSnapshot.id,
            pageUrl,
            diff: diff.rawDiff.slice(0, 10000),
            summary: aiSummary.summary,
            severity: aiSummary.severity,
          },
        })

        pageResults.push({ pageUrl, status: 'change_detected', changeDetected: true })
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        pageResults.push({ pageUrl, status: `error: ${msg}` })
      }
    }

    results.push({
      competitorId: competitor.id,
      competitorName: competitor.name,
      pages: pageResults,
    })
  }

  return NextResponse.json({ results })
}
