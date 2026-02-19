import { prisma } from './db'
import nodemailer from 'nodemailer'

const SEVERITY_RANK: Record<string, number> = { low: 0, medium: 1, high: 2 }

const SEVERITY_COLOR: Record<string, string> = {
  low: '#48bb78',
  medium: '#ed8936',
  high: '#e53e3e',
}

const SEVERITY_EMOJI: Record<string, string> = {
  low: '🟢',
  medium: '🟡',
  high: '🔴',
}

export async function sendNotification(
  change: { id: string; pageUrl: string; summary: string; severity: string },
  competitor: { id: string; name: string; url: string }
): Promise<void> {
  let settings: Record<string, string> = {}
  try {
    const rows = await prisma.setting.findMany()
    for (const row of rows) {
      settings[row.key] = row.value
    }
  } catch (err) {
    console.error('[notifications] Failed to load settings:', err)
    return
  }

  const minSeverity = settings['notify_min_severity'] ?? 'high'
  const changeRank = SEVERITY_RANK[change.severity] ?? 0
  const minRank = SEVERITY_RANK[minSeverity] ?? 2

  if (changeRank < minRank) return

  const severityLabel = change.severity.charAt(0).toUpperCase() + change.severity.slice(1)
  const emoji = SEVERITY_EMOJI[change.severity] ?? '⚪'
  const color = SEVERITY_COLOR[change.severity] ?? '#718096'

  // Webhook notification
  if (settings['webhook_enabled'] === 'true' && settings['webhook_url']) {
    try {
      const payload = {
        text: `${emoji} *[${competitor.name}]* — ${severityLabel} severity change detected`,
        attachments: [
          {
            color,
            title: `Page changed: ${change.pageUrl}`,
            title_link: change.pageUrl,
            text: change.summary,
            fields: [
              { title: 'Competitor', value: competitor.name, short: true },
              { title: 'Severity', value: `${emoji} ${severityLabel}`, short: true },
            ],
            footer: 'CompetitorWatch',
            ts: Math.floor(Date.now() / 1000),
          },
        ],
      }

      const res = await fetch(settings['webhook_url'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        console.error(`[notifications] Webhook POST failed: ${res.status} ${res.statusText}`)
      } else {
        console.log(`[notifications] Webhook sent for change ${change.id}`)
      }
    } catch (err) {
      console.error('[notifications] Webhook error:', err)
    }
  }

  // Email notification
  const emailEnabled = settings['email_enabled'] === 'true'
  const smtpHost = settings['email_smtp_host']
  const smtpPort = settings['email_smtp_port']
  const smtpUser = settings['email_smtp_user']
  const smtpPassword = settings['email_smtp_password']
  const emailFrom = settings['email_from']
  const emailTo = settings['email_to']

  if (emailEnabled && smtpHost && smtpPort && smtpUser && smtpPassword && emailFrom && emailTo) {
    try {
      const port = parseInt(smtpPort, 10)
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port,
        secure: port === 465,
        auth: { user: smtpUser, pass: smtpPassword },
      })

      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a202c;">CompetitorWatch Alert</h2>
          <div style="background: ${color}; color: white; display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; margin-bottom: 16px;">
            ${emoji} ${severityLabel} Severity
          </div>
          <h3 style="color: #2d3748;">${competitor.name}</h3>
          <p style="color: #4a5568;">A change was detected on one of their monitored pages.</p>
          <table style="border-collapse: collapse; width: 100%; margin-bottom: 16px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background: #f7fafc;">Page</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;"><a href="${change.pageUrl}">${change.pageUrl}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold; background: #f7fafc;">Severity</td>
              <td style="padding: 8px; border: 1px solid #e2e8f0;">${emoji} ${severityLabel}</td>
            </tr>
          </table>
          <h4 style="color: #2d3748;">AI Summary</h4>
          <div style="background: #f7fafc; border-left: 4px solid ${color}; padding: 12px 16px; color: #4a5568;">
            ${change.summary}
          </div>
          <p style="color: #a0aec0; font-size: 12px; margin-top: 24px;">Sent by CompetitorWatch</p>
        </div>
      `

      await transporter.sendMail({
        from: emailFrom,
        to: emailTo,
        subject: `${emoji} [${competitor.name}] ${severityLabel} severity change detected`,
        html,
      })

      console.log(`[notifications] Email sent for change ${change.id}`)
    } catch (err) {
      console.error('[notifications] Email error:', err)
    }
  }
}
