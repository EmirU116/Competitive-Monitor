'use client'

import Link from 'next/link'

interface CompetitorCardProps {
  id: string
  name: string
  url: string
  pages: string // JSON string
  snapshots: { createdAt: string }[]
  onScan: (id: string) => void
  scanning: boolean
}

export default function CompetitorCard({
  id,
  name,
  url,
  pages,
  snapshots,
  onScan,
  scanning,
}: CompetitorCardProps) {
  const pageList: string[] = JSON.parse(pages)
  const lastScan = snapshots[0]?.createdAt
    ? new Date(snapshots[0].createdAt).toLocaleString()
    : 'Never'
  const hostname = (() => {
    try { return new URL(url).hostname } catch { return url }
  })()

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Top accent */}
      <div className="h-1 bg-blue-500" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/competitors/${id}`}
              className="text-base font-semibold text-gray-900 hover:text-blue-600 truncate block"
            >
              {name}
            </Link>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-blue-500 truncate block mt-0.5"
            >
              {hostname}
            </a>
          </div>
          <button
            onClick={() => onScan(id)}
            disabled={scanning}
            className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {scanning ? 'Scanning…' : 'Scan Now'}
          </button>
        </div>

        {/* Meta */}
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            {pageList.length} page{pageList.length !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {lastScan}
          </span>
        </div>

        {/* Page tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {pageList.slice(0, 3).map((p) => (
            <span
              key={p}
              className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full truncate max-w-[180px]"
              title={p}
            >
              {p.replace(/^https?:\/\//, '')}
            </span>
          ))}
          {pageList.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
              +{pageList.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
