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

export default function DashboardPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [changes, setChanges] = useState<Change[]>([])
  const [scanningId, setScanningId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchData() {
    const [compRes, changeRes] = await Promise.all([
      fetch('/api/competitors'),
      fetch('/api/changes'),
    ])
    setCompetitors(await compRes.json())
    setChanges(await changeRes.json())
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

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
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading…
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {competitors.length} competitor{competitors.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <Link
          href="/competitors/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Competitor
        </Link>
      </div>

      {/* Competitors Grid */}
      {competitors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-400 text-lg mb-4">No competitors tracked yet</p>
          <Link
            href="/competitors/new"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Add your first competitor →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {competitors.map((c) => (
            <CompetitorCard
              key={c.id}
              {...c}
              onScan={handleScan}
              scanning={scanningId === c.id}
            />
          ))}
        </div>
      )}

      {/* Recent Changes */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Changes</h2>
        {changes.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-400">No changes detected yet. Run a scan to get started.</p>
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
    </div>
  )
}
