import AddCompetitorForm from '@/components/AddCompetitorForm'
import Link from 'next/link'

export default function NewCompetitorPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-3">Add Competitor</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter the competitor details and the pages you want to monitor for changes.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <AddCompetitorForm />
      </div>
    </div>
  )
}
