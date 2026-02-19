import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const changes = await prisma.change.findMany({
    orderBy: { detectedAt: 'desc' },
    take: 50,
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
}
