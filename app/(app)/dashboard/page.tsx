'use client'

import { useEffect, useState } from 'react'
import CompetitorCard from '@/components/CompetitorCard'
import ChangeItem from '@/components/ChangeItem'
import Link from 'next/link'

interface Competitor {
  id: string
  name: string
  url: string
  pages: string
  snapshots: { createdAt: string }[]
}

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

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function DashboardPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [changes, setChanges] = useState<Change[]>([])
  const [scanningId, setScanningId] = useState<string | null>(null)
  const [scanningAll, setScanningAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  async function fetchData() {
    try {
      const [compRes, changeRes] = await Promise.all([
        fetch('/api/competitors'),
        fetch('/api/changes'),
      ])
      if (!compRes.ok || !changeRes.ok) throw new Error('Failed to load data')
      setCompetitors(await compRes.json())
      setChanges(await changeRes.json())
      setFetchError(null)
    } catch {
      setFetchError('Failed to load data. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function handleScanAll() {
    setScanningAll(true)
    try {
      await fetch('/api/scan/all', { method: 'POST' })
      await fetchData()
    } finally {
      setScanningAll(false)
    }
  }

  async function handleScan(id: string) {
    setScanningId(id)
    try {
      await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorId: id }),
      })
      await fetchData()
    } finally {
      setScanningId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading dashboard…</p>
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-sm text-red-500">{fetchError}</p>
        </div>
      </div>
    )
  }

  const highSeverity = changes.filter((c) => c.severity === 'high').length
  const lastScanDate = competitors
    .flatMap((c) => c.snapshots)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    ?.createdAt

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {competitors.length === 0
              ? 'No competitors tracked yet'
              : `Monitoring ${competitors.length} competitor${competitors.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {competitors.length > 0 && (
            <button
              onClick={handleScanAll}
              disabled={scanningAll || scanningId !== null}
              className="inline-flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {scanningAll ? (
                <>
                  <span className="w-3.5 h-3.5 border border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                  Scanning…
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Scan All
                </>
              )}
            </button>
          )}
          <Link
            href="/competitors/new"
            className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Competitor
          </Link>
        </div>
      </div>

      {/* Stats row */}
      {competitors.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Competitors</p>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{competitors.length}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Changes</p>
              <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{changes.length}</p>
            <p className="text-xs text-gray-400 mt-1">last 50</p>
          </div>

          <div className={`rounded-xl border p-5 shadow-sm ${highSeverity > 0 ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">High Severity</p>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${highSeverity > 0 ? 'bg-red-100 dark:bg-red-900/40' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <svg className={`w-3.5 h-3.5 ${highSeverity > 0 ? 'text-red-500' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
            </div>
            <p className={`text-3xl font-bold ${highSeverity > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {highSeverity}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Scan</p>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {lastScanDate ? timeAgo(lastScanDate) : '—'}
            </p>
          </div>
        </div>
      )}

      {/* Competitors */}
      {competitors.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-1">No competitors tracked yet</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
            Add a competitor to start monitoring their website for changes.
          </p>
          <Link
            href="/competitors/new"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add your first competitor
          </Link>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Competitors
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {competitors.map((c) => (
              <CompetitorCard
                key={c.id}
                {...c}
                onScan={handleScan}
                scanning={scanningId === c.id || scanningAll}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent changes */}
      {competitors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Recent Changes
            </h2>
            {changes.length > 0 && (
              <span className="text-xs text-gray-400">{changes.length} detected</span>
            )}
          </div>
          {changes.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <p className="text-gray-400 text-sm">No changes detected yet. Run a scan to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {changes.map((c) => (
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
      )}
    </div>
  )
}
