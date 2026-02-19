'use client'

import { useEffect, useState } from 'react'

type Settings = {
  notify_min_severity: string
  webhook_enabled: string
  webhook_url: string
  email_enabled: string
  email_smtp_host: string
  email_smtp_port: string
  email_smtp_user: string
  email_smtp_password: string
  email_from: string
  email_to: string
}

const DEFAULTS: Settings = {
  notify_min_severity: 'high',
  webhook_enabled: 'false',
  webhook_url: '',
  email_enabled: 'false',
  email_smtp_host: '',
  email_smtp_port: '587',
  email_smtp_user: '',
  email_smtp_password: '',
  email_from: '',
  email_to: '',
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        checked ? 'bg-indigo-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedBadge, setSavedBadge] = useState(false)

  const [webhookTestStatus, setWebhookTestStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [webhookTestError, setWebhookTestError] = useState('')

  const [emailTestStatus, setEmailTestStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [emailTestError, setEmailTestError] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        setSettings((prev) => ({ ...prev, ...data }))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function set(key: keyof Settings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        setSavedBadge(true)
        setTimeout(() => setSavedBadge(false), 3000)
      }
    } catch (err) {
      console.error('Failed to save settings:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleTestWebhook() {
    setWebhookTestStatus('loading')
    setWebhookTestError('')
    try {
      const res = await fetch('/api/settings/test-webhook', { method: 'POST' })
      const data = await res.json()
      if (res.ok && data.ok) {
        setWebhookTestStatus('ok')
      } else {
        setWebhookTestStatus('error')
        setWebhookTestError(data.error ?? 'Unknown error')
      }
    } catch (err) {
      setWebhookTestStatus('error')
      setWebhookTestError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  async function handleTestEmail() {
    setEmailTestStatus('loading')
    setEmailTestError('')
    try {
      const res = await fetch('/api/settings/test-email', { method: 'POST' })
      const data = await res.json()
      if (res.ok && data.ok) {
        setEmailTestStatus('ok')
      } else {
        setEmailTestStatus('error')
        setEmailTestError(data.error ?? 'Unknown error')
      }
    } catch (err) {
      setEmailTestStatus('error')
      setEmailTestError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
        Loading settings…
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-28 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure how and when you receive alerts about competitor changes.
        </p>
      </div>

      {/* Threshold card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Notification Threshold</h2>
        <p className="text-sm text-gray-500 mb-4">
          Only send notifications for changes at or above this severity level.
        </p>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 w-32">Min severity</label>
          <select
            value={settings.notify_min_severity}
            onChange={(e) => set('notify_min_severity', e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="low">🟢 Low — all changes</option>
            <option value="medium">🟡 Medium and above</option>
            <option value="high">🔴 High only</option>
          </select>
        </div>
      </div>

      {/* Webhook card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-gray-900">Webhook</h2>
          <Toggle
            checked={settings.webhook_enabled === 'true'}
            onChange={() =>
              set('webhook_enabled', settings.webhook_enabled === 'true' ? 'false' : 'true')
            }
          />
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Send Slack-compatible webhook payloads to any URL (Slack, Discord, Teams, etc.).
        </p>

        {settings.webhook_enabled === 'true' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
              <input
                type="url"
                placeholder="https://hooks.slack.com/services/..."
                value={settings.webhook_url}
                onChange={(e) => set('webhook_url', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={webhookTestStatus === 'loading' || !settings.webhook_url}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                {webhookTestStatus === 'loading' ? 'Sending…' : 'Send Test'}
              </button>
              {webhookTestStatus === 'ok' && (
                <span className="text-sm font-medium text-green-600">✓ Test sent successfully</span>
              )}
              {webhookTestStatus === 'error' && (
                <span className="text-sm text-red-600">✗ {webhookTestError}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Email card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-gray-900">Email</h2>
          <Toggle
            checked={settings.email_enabled === 'true'}
            onChange={() =>
              set('email_enabled', settings.email_enabled === 'true' ? 'false' : 'true')
            }
          />
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Send HTML email alerts via SMTP (works with Mailtrap, SendGrid, Gmail, etc.).
        </p>

        {settings.email_enabled === 'true' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                <input
                  type="text"
                  placeholder="smtp.mailtrap.io"
                  value={settings.email_smtp_host}
                  onChange={(e) => set('email_smtp_host', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                <input
                  type="number"
                  placeholder="587"
                  value={settings.email_smtp_port}
                  onChange={(e) => set('email_smtp_port', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
                <input
                  type="text"
                  placeholder="username"
                  value={settings.email_smtp_user}
                  onChange={(e) => set('email_smtp_user', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={settings.email_smtp_password}
                  onChange={(e) => set('email_smtp_password', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Address</label>
              <input
                type="email"
                placeholder="alerts@yourcompany.com"
                value={settings.email_from}
                onChange={(e) => set('email_from', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Address(es)
              </label>
              <input
                type="text"
                placeholder="you@example.com, team@example.com"
                value={settings.email_to}
                onChange={(e) => set('email_to', e.target.value)}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-gray-400">Separate multiple addresses with commas.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTestEmail}
                disabled={emailTestStatus === 'loading'}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                {emailTestStatus === 'loading' ? 'Sending…' : 'Send Test Email'}
              </button>
              {emailTestStatus === 'ok' && (
                <span className="text-sm font-medium text-green-600">✓ Test email sent</span>
              )}
              {emailTestStatus === 'error' && (
                <span className="text-sm text-red-600">✗ {emailTestError}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 z-10">
        {savedBadge && (
          <span className="text-sm font-medium text-green-600">✓ Saved!</span>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
