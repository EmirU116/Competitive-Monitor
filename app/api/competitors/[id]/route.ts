import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const competitor = await prisma.competitor.findUnique({
    where: { id },
    include: {
      snapshots: {
        orderBy: { createdAt: 'desc' },
        include: {
          changes: {
            orderBy: { detectedAt: 'desc' },
          },
        },
      },
    },
  })

  if (!competitor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(competitor)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.competitor.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
