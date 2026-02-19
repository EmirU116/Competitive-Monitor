'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ChangeItem from '@/components/ChangeItem'
import Link from 'next/link'

interface Change {
  id: string
  pageUrl: string
  diff: string
  summary: string
  severity: string
  detectedAt: string
}

interface Snapshot {
  id: string
  pageUrl: string
  createdAt: string
  changes: Change[]
}

interface Competitor {
  id: string
  name: string
  url: string
  pages: string
  createdAt: string
  snapshots: Snapshot[]
}

export default function CompetitorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [competitor, setCompetitor] = useState<Competitor | null>(null)
  const [scanning, setScanning] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const fetchCompetitor = useCallback(async () => {
    const res = await fetch(`/api/competitors/${id}`)
    if (!res.ok) {
      setLoading(false)
      router.push('/dashboard')
      return
    }
    setCompetitor(await res.json())
    setLoading(false)
  }, [id, router])

  useEffect(() => {
    fetchCompetitor()
  }, [fetchCompetitor])

  async function handleScan() {
    setScanning(true)
    try {
      await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorId: id }),
      })
      await fetchCompetitor()
    } finally {
      setScanning(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete ${competitor?.name}? This cannot be undone.`)) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await fetch(`/api/competitors/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      router.push('/dashboard')
    } catch {
      setDeleteError('Failed to delete. Please try again.')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      </div>
    )
  }

  if (!competitor) return null

  let pages: string[] = []
  try { pages = JSON.parse(competitor.pages) } catch { /* malformed — show empty list */ }

  const allChanges = competitor.snapshots
    .flatMap((s) => s.changes)
    .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())

  const lastScan = competitor.snapshots[0]?.createdAt

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Dashboard
        </Link>

        <div className="flex items-start justify-between mt-3 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{competitor.name}</h1>
            <a
              href={competitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 dark:text-gray-500 hover:text-indigo-500 transition-colors mt-0.5 inline-block"
            >
              {competitor.url}
            </a>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleScan}
                disabled={scanning}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {scanning ? (
                  <>
                    <span className="w-3.5 h-3.5 border border-indigo-300 border-t-white rounded-full animate-spin" />
                    Scanning…
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Scan Now
                  </>
                )}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
            {deleteError && (
              <p className="text-xs text-red-600">{deleteError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
            <svg className="w-3.5 h-3.5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p className="text-xs text-gray-500 mb-1">Pages Monitored</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{pages.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
          <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center mb-3">
            <svg className="w-3.5 h-3.5 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <p className="text-xs text-gray-500 mb-1">Total Scans</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{competitor.snapshots.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
            <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <p className="text-xs text-gray-500 mb-1">Changes Detected</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{allChanges.length}</p>
        </div>
      </div>

      {/* Monitored pages */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Monitored Pages</h2>
        <ul className="space-y-2">
          {pages.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
              <a
                href={p}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:underline truncate"
              >
                {p}
              </a>
            </li>
          ))}
        </ul>
        {lastScan && (
          <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            Last scan: {new Date(lastScan).toLocaleString()}
          </p>
        )}
      </div>

      {/* Change Timeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Change Timeline
          </h2>
          {allChanges.length > 0 && (
            <span className="text-xs text-gray-400">{allChanges.length} changes</span>
          )}
        </div>
        {allChanges.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <p className="text-gray-400 text-sm">
              {competitor.snapshots.length === 0
                ? 'Run your first scan to capture a baseline.'
                : competitor.snapshots.length === 1
                ? 'Baseline captured. Run another scan to detect changes.'
                : 'Pages appear unchanged since last scan.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {allChanges.map((c) => (
              <ChangeItem
                key={c.id}
                pageUrl={c.pageUrl}
                summary={c.summary}
                severity={c.severity}
                detectedAt={c.detectedAt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
