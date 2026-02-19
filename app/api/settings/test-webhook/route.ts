import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST() {
  const rows = await prisma.setting.findMany()
  const settings: Record<string, string> = {}
  for (const row of rows) {
    settings[row.key] = row.value
  }

  const webhookUrl = settings['webhook_url']
  if (!webhookUrl) {
    return NextResponse.json({ error: 'No webhook URL configured' }, { status: 400 })
  }

  try {
    const payload = {
      text: '🟢 *[CompetitorWatch]* — Test notification',
      attachments: [
        {
          color: '#48bb78',
          title: 'Test Notification',
          text: 'This is a test notification from CompetitorWatch. If you see this, your webhook is configured correctly.',
          fields: [
            { title: 'Status', value: '🟢 Success', short: true },
            { title: 'Source', value: 'Settings → Test', short: true },
          ],
          footer: 'CompetitorWatch',
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Webhook responded with ${res.status} ${res.statusText}` },
        { status: 400 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
