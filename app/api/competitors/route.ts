import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const competitors = await prisma.competitor.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        snapshots: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { createdAt: true },
        },
      },
    })
    return NextResponse.json(competitors)
  } catch (err) {
    console.error('GET /api/competitors failed:', err)
    return NextResponse.json({ error: 'Failed to fetch competitors' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, url, pages } = body

    if (!name || !url || !pages?.length) {
      return NextResponse.json(
        { error: 'name, url, and pages are required' },
        { status: 400 }
      )
    }

    const competitor = await prisma.competitor.create({
      data: {
        name,
        url,
        pages: JSON.stringify(pages),
      },
    })

    return NextResponse.json(competitor, { status: 201 })
  } catch (err) {
    console.error('POST /api/competitors failed:', err)
    return NextResponse.json({ error: 'Failed to create competitor' }, { status: 500 })
  }
}
