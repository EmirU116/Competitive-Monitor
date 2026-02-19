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
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Loading…
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500 text-sm">
        {fetchError}
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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Monitoring {competitors.length} competitor{competitors.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {competitors.length > 0 && (
            <button
              onClick={handleScanAll}
              disabled={scanningAll || scanningId !== null}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {scanningAll ? 'Scanning all…' : 'Scan All'}
            </button>
          )}
          <Link
            href="/competitors/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Competitor
          </Link>
        </div>
      </div>

      {/* Stats row */}
      {competitors.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Competitors</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{competitors.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Changes Detected</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{changes.length}</p>
            <p className="text-xs text-gray-400 mt-1">last 50</p>
          </div>
          <div className={`rounded-xl border p-5 ${highSeverity > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">High Severity</p>
            <p className={`text-3xl font-bold mt-1 ${highSeverity > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {highSeverity}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Scan</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {lastScanDate ? timeAgo(lastScanDate) : '—'}
            </p>
          </div>
        </div>
      )}

      {/* Competitors */}
      {competitors.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <p className="text-gray-900 font-medium">No competitors tracked yet</p>
          <p className="text-gray-400 text-sm mt-1 mb-5">Add a competitor to start monitoring their website for changes.</p>
          <Link
            href="/competitors/new"
            className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add your first competitor
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Competitors</h2>
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
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Changes</h2>
          {changes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
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
