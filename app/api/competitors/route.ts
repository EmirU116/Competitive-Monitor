import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
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
}

export async function POST(req: NextRequest) {
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
}
