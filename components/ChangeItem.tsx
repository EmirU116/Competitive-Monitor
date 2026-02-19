'use client'

import Link from 'next/link'

interface ChangeItemProps {
  pageUrl: string
  summary: string
  severity: string
  detectedAt: string
  competitorName?: string
  competitorId?: string
}

const severityConfig = {
  high: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
    label: 'High',
  },
  medium: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-500',
    label: 'Medium',
  },
  low: {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    badge: 'bg-slate-100 text-slate-600',
    dot: 'bg-slate-400',
    label: 'Low',
  },
}

export default function ChangeItem({
  pageUrl,
  summary,
  severity,
  detectedAt,
  competitorName,
  competitorId,
}: ChangeItemProps) {
  const sev = (severity in severityConfig ? severity : 'low') as keyof typeof severityConfig
  const cfg = severityConfig[sev]

  return (
    <div className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
        <div className="min-w-0 flex-1">
          {/* Top row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {competitorName && competitorId && (
              <Link
                href={`/competitors/${competitorId}`}
                className="text-sm font-semibold text-gray-900 hover:text-blue-600"
              >
                {competitorName}
              </Link>
            )}
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
              {cfg.label}
            </span>
            <span className="text-xs text-gray-400 ml-auto">
              {new Date(detectedAt).toLocaleString()}
            </span>
          </div>

          {/* Summary */}
          <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>

          {/* Page URL */}
          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs text-gray-400 hover:text-blue-500 truncate block"
          >
            {pageUrl}
          </a>
        </div>
      </div>
    </div>
  )
}
