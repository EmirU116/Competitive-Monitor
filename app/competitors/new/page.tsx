import AddCompetitorForm from '@/components/AddCompetitorForm'
import Link from 'next/link'

export default function NewCompetitorPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Add Competitor</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter the competitor details and the pages you want to monitor for changes.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <AddCompetitorForm />
      </div>
    </div>
  )
}
