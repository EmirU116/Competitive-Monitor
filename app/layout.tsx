import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import SidebarNav from '@/components/SidebarNav'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Competitive Intelligence Monitor',
  description: 'Track competitor websites and get AI-powered change summaries',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} ${geistMono.variable} bg-gray-50 min-h-screen flex`}>
        {/* Sidebar */}
        <aside className="w-56 bg-slate-900 flex flex-col shrink-0 sticky top-0 h-screen">
          {/* Logo */}
          <div className="px-4 py-5 border-b border-slate-800">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-white">CompetitorWatch</span>
            </Link>
          </div>
          {/* Navigation */}
          <SidebarNav />
          {/* Footer */}
          <div className="px-4 py-4 border-t border-slate-800">
            <p className="text-xs text-slate-500">Auto-scans every hour</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-auto">
          <div className="max-w-5xl mx-auto px-8 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
