'use client'

import { useEffect, useState } from 'react'
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

  async function fetchCompetitor() {
    const res = await fetch(`/api/competitors/${id}`)
    if (!res.ok) {
      router.push('/dashboard')
      return
    }
    setCompetitor(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    fetchCompetitor()
  }, [id])

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
    await fetch(`/api/competitors/${id}`, { method: 'DELETE' })
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading…
      </div>
    )
  }

  if (!competitor) return null

  const pages: string[] = JSON.parse(competitor.pages)

  // Collect all changes across all snapshots, sorted newest first
  const allChanges = competitor.snapshots
    .flatMap((s) => s.changes)
    .sort(
      (a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    )

  const lastScan = competitor.snapshots[0]?.createdAt

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
          ← Dashboard
        </Link>
        <div className="flex items-start justify-between mt-2 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{competitor.name}</h1>
            <a
              href={competitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-blue-500"
            >
              {competitor.url}
            </a>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleScan}
              disabled={scanning}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {scanning ? 'Scanning…' : 'Scan Now'}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-white border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Pages Monitored</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{pages.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Total Scans</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {competitor.snapshots.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Changes Detected</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{allChanges.length}</p>
        </div>
      </div>

      {/* Monitored pages */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Monitored Pages</h2>
        <ul className="space-y-1">
          {pages.map((p) => (
            <li key={p}>
              <a
                href={p}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline truncate block"
              >
                {p}
              </a>
            </li>
          ))}
        </ul>
        {lastScan && (
          <p className="text-xs text-gray-400 mt-3">
            Last scan: {new Date(lastScan).toLocaleString()}
          </p>
        )}
      </div>

      {/* Change Timeline */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Timeline</h2>
        {allChanges.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-400">
              No changes detected yet.{' '}
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
