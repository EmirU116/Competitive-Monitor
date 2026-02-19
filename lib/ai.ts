import Anthropic from '@anthropic-ai/sdk'
import { DiffResult } from './diff'

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set. Add it to .env.local before running the app.')
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

export interface AISummary {
  summary: string
  severity: 'low' | 'medium' | 'high'
  keyChanges: string[]
}

export async function generateChangeSummary(
  competitorName: string,
  pageUrl: string,
  diff: DiffResult
): Promise<AISummary> {
  const prompt = `You are a competitive intelligence analyst. A competitor's website page has changed.

Competitor: ${competitorName}
Page URL: ${pageUrl}
Change percentage: ${diff.changePercent}%

Added content:
${diff.added.slice(0, 20).join('\n') || '(none)'}

Removed content:
${diff.removed.slice(0, 20).join('\n') || '(none)'}

Raw diff (first 3000 chars):
${diff.rawDiff.slice(0, 3000)}

Analyze this change and respond with ONLY valid JSON in this exact format:
{
  "summary": "1-2 sentence plain-English summary of what changed and why it matters competitively",
  "severity": "low|medium|high",
  "keyChanges": ["bullet point 1", "bullet point 2", "bullet point 3"]
}

Severity guide:
- high: pricing changes, new product launches, major feature announcements
- medium: messaging updates, new content sections, team/partnership news
- low: minor copy tweaks, small layout changes, blog posts`

  const message = await getClient().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system:
      'You are a competitive intelligence analyst. Always respond with valid JSON only, no markdown, no explanation.',
    messages: [{ role: 'user', content: prompt }],
  })

  const text =
    message.content[0].type === 'text' ? message.content[0].text : '{}'

  try {
    const parsed = JSON.parse(text)
    return {
      summary: parsed.summary || 'No summary available',
      severity: ['low', 'medium', 'high'].includes(parsed.severity)
        ? parsed.severity
        : 'low',
      keyChanges: Array.isArray(parsed.keyChanges) ? parsed.keyChanges : [],
    }
  } catch {
    return {
      summary: 'Could not parse AI summary.',
      severity: 'low',
      keyChanges: [],
    }
  }
}
