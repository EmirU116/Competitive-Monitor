import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import nodemailer from 'nodemailer'

export async function POST() {
  const rows = await prisma.setting.findMany()
  const settings: Record<string, string> = {}
  for (const row of rows) {
    settings[row.key] = row.value
  }

  const smtpHost = settings['email_smtp_host']
  const smtpPort = settings['email_smtp_port']
  const smtpUser = settings['email_smtp_user']
  const smtpPassword = settings['email_smtp_password']
  const emailFrom = settings['email_from']
  const emailTo = settings['email_to']

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !emailFrom || !emailTo) {
    return NextResponse.json(
      { error: 'All SMTP fields (host, port, user, password, from, to) must be configured' },
      { status: 400 }
    )
  }

  try {
    const port = parseInt(smtpPort, 10)
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port,
      secure: port === 465,
      auth: { user: smtpUser, pass: smtpPassword },
    })

    await transporter.sendMail({
      from: emailFrom,
      to: emailTo,
      subject: '🟢 CompetitorWatch — Test Email',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a202c;">CompetitorWatch — Test Email</h2>
          <div style="background: #48bb78; color: white; display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; margin-bottom: 16px;">
            🟢 Success
          </div>
          <p style="color: #4a5568;">
            This is a test email from CompetitorWatch. If you received this, your email notifications are configured correctly.
          </p>
          <p style="color: #a0aec0; font-size: 12px; margin-top: 24px;">Sent by CompetitorWatch</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
