import Link from 'next/link'

const features = [
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-900/30',
    title: 'Automated Scraping',
    description:
      'Add any URL and CompetitorWatch checks it on a schedule using headless browser technology. No browser extensions, no manual checks, no missed updates.',
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-900/30',
    title: 'AI-Powered Summaries',
    description:
      'Every change is analyzed by Claude AI, which writes a plain-English summary explaining what changed and what it might mean for your business — not just raw diffs.',
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    title: 'Severity Ratings',
    description:
      'Changes are automatically rated High, Medium, or Low so your team knows exactly what to prioritize without reading every diff or opening every page.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Add competitors',
    description:
      'Enter the competitor name and the specific pages you want to watch — pricing, features, blog, landing pages. Whatever matters to your business.',
  },
  {
    number: '02',
    title: 'Monitor automatically',
    description:
      'CompetitorWatch scrapes each page on a schedule, captures a full snapshot, and diffs it against the previous version to find what changed.',
  },
  {
    number: '03',
    title: 'Get the context',
    description:
      'When something changes, Claude AI reads the diff and writes a clear summary: what changed, where it changed, and how significant it is.',
  },
]

const benefits = [
  'Never miss a pricing or packaging change',
  "Spot new features before they're widely announced",
  'Track messaging and positioning shifts over time',
  'React to product page updates before your customers do',
  'All data stays in your own database — nothing shared externally',
  'Self-hosted with no SaaS subscription required',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans">
      {/* ── Navbar ─────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">CompetitorWatch</span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm text-gray-500 dark:text-gray-400">
            <a href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900 dark:hover:text-white transition-colors">How it works</a>
            <a href="#why" className="hover:text-gray-900 dark:hover:text-white transition-colors">Why use this</a>
          </nav>

          {/* CTA */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Open Dashboard
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────── */}
      <section className="bg-slate-950 relative overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.25),transparent)]" />
        {/* Top shimmer line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-6 py-28 lg:py-40 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-indigo-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Powered by Claude AI
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-bold text-white tracking-tight leading-[1.1] mb-6">
            Stay one step ahead<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400">
              of your competitors
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            CompetitorWatch automatically monitors competitor websites, detects every change,
            and delivers AI-powered summaries with severity ratings — so your team always
            knows what&apos;s moving in the market.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-colors shadow-xl shadow-indigo-500/20"
            >
              Open Dashboard
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white px-7 py-3.5 rounded-xl text-sm font-medium transition-colors"
            >
              See how it works
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      {/* ── Pill strip ─────────────────────────── */}
      <section className="bg-slate-950 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {[
              'Automated monitoring',
              'Claude AI summaries',
              'Severity ratings',
              'Self-hosted & private',
              'SQLite — no external DB',
            ].map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm text-slate-500">
                <svg className="w-3.5 h-3.5 text-indigo-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────── */}
      <section id="features" className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to track the competition
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
              From automated scraping to AI-written summaries, CompetitorWatch handles
              the entire monitoring pipeline so you don&apos;t have to.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-gray-100 dark:border-gray-800 p-8 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-lg transition-all group dark:bg-gray-900"
              >
                <div className={`w-11 h-11 rounded-xl ${f.bg} ${f.color} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────── */}
      <section id="how-it-works" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Up and running in minutes
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
              Three straightforward steps from setup to automated, AI-powered competitive intelligence.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Connector line between steps */}
            <div className="hidden sm:block absolute top-8 left-[calc(16.67%+2.5rem)] right-[calc(16.67%+2.5rem)] h-px bg-gray-200 dark:bg-gray-700" />

            {steps.map((step) => (
              <div key={step.number}>
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-indigo-600">{step.number}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why section ────────────────────────── */}
      <section id="why" className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">Why CompetitorWatch</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-5">
                Built for teams that can&apos;t afford to miss anything
              </h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                Competitive intelligence used to mean expensive SaaS subscriptions or
                time-consuming manual checks. Neither option scales.
              </p>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                CompetitorWatch gives you automated, AI-powered monitoring that runs on your
                own infrastructure — no usage caps, no data leaving your server, no recurring bill.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                Start monitoring
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3.5 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────── */}
      <section className="bg-slate-950 py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_120%,rgba(99,102,241,0.2),transparent)]" />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Stop checking manually.<br />Start monitoring automatically.
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Add your first competitor in under a minute and let CompetitorWatch
              handle the rest — 24/7, on a schedule, with AI-powered context.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-colors shadow-2xl shadow-indigo-500/20"
            >
              Open Dashboard
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="bg-slate-950 border-t border-slate-800/50 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-indigo-500 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-400">CompetitorWatch</span>
          </div>
          <p className="text-xs text-slate-600">Built with Next.js and Claude AI</p>
        </div>
      </footer>
    </div>
  )
}
