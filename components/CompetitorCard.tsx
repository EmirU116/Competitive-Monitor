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

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/competitors/${id}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 truncate block"
          >
            {name}
          </Link>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-blue-500 truncate block mt-0.5"
          >
            {url}
          </a>
        </div>
        <button
          onClick={() => onScan(id)}
          disabled={scanning}
          className="shrink-0 text-sm px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {scanning ? 'Scanning…' : 'Scan Now'}
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500 space-y-1">
        <p>
          <span className="font-medium">Pages monitored:</span> {pageList.length}
        </p>
        <p>
          <span className="font-medium">Last scan:</span> {lastScan}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {pageList.slice(0, 3).map((p) => (
          <span
            key={p}
            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full truncate max-w-[180px]"
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
  )
}
