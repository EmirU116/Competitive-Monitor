'use client'

import { useEffect, useState } from 'react'
import ChangeItem from '@/components/ChangeItem'

interface Change {
  id: string
  pageUrl: string
  summary: string
  severity: string
  detectedAt: string
  snapshot: {
    competitor: {
      id: string
      name: string
      url: string
    }
  }
}

type Severity = 'all' | 'high' | 'medium' | 'low'

const SEVERITY_OPTIONS: { value: Severity; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export default function ChangelogPage() {
  const [changes, setChanges] = useState<Change[]>([])
  const [loading, setLoading] = useState(true)
  const [severity, setSeverity] = useState<Severity>('all')

  useEffect(() => {
    fetch('/api/changes')
      .then((res) => res.json())
      .then((data) => setChanges(data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = severity === 'all' ? changes : changes.filter((c) => c.severity === severity)
  const highCount = changes.filter((c) => c.severity === 'high').length

  const subtitle =
    severity === 'all'
      ? `${changes.length} change${changes.length !== 1 ? 's' : ''} detected`
      : `${filtered.length} ${severity} / ${changes.length} total`

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading changelog…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Changelog</h1>
        <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
      </div>

      {/* Severity filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {SEVERITY_OPTIONS.map((opt) => {
          const active = severity === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setSeverity(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {opt.label}
              {opt.value === 'high' && highCount > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-indigo-500 text-white' : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'}`}>
                  {highCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Change list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-gray-400 text-sm">
            {changes.length === 0
              ? 'No changes detected yet. Run a scan to get started.'
              : `No ${severity} severity changes found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <ChangeItem
              key={c.id}
              pageUrl={c.pageUrl}
              summary={c.summary}
              severity={c.severity}
              detectedAt={c.detectedAt}
              competitorName={c.snapshot.competitor.name}
              competitorId={c.snapshot.competitor.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
