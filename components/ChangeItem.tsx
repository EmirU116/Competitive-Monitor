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
  },
  medium: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-700',
    dot: 'bg-yellow-500',
  },
  low: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-400',
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
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {competitorName && competitorId && (
              <a
                href={`/competitors/${competitorId}`}
                className="text-sm font-semibold text-gray-800 hover:text-blue-600"
              >
                {competitorName}
              </a>
            )}
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${cfg.badge}`}
            >
              {sev}
            </span>
            <span className="text-xs text-gray-400 ml-auto">
              {new Date(detectedAt).toLocaleString()}
            </span>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>

          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-xs text-gray-400 hover:text-blue-500 truncate block"
          >
            {pageUrl}
          </a>
        </div>
      </div>
    </div>
  )
}
