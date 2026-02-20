import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const changes = await prisma.change.findMany({
      orderBy: { detectedAt: 'desc' },
      include: {
        snapshot: {
          include: {
            competitor: {
              select: { id: true, name: true, url: true },
            },
          },
        },
      },
    })
    return NextResponse.json(changes)
  } catch (err) {
    console.error('GET /api/changes failed:', err)
    return NextResponse.json({ error: 'Failed to fetch changes' }, { status: 500 })
  }
}
