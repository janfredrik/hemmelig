import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateKey, keyToBase64url, encrypt } from '../crypto'
import { apiCreateSecret } from '../api'

const EXPIRY_OPTIONS = [
  { label: '1 Hour',   value: 3600 },
  { label: '6 Hours',  value: 21600 },
  { label: '1 Day',    value: 86400 },
  { label: '3 Days',   value: 259200 },
  { label: '7 Days',   value: 604800 },
  { label: '30 Days',  value: 2592000 },
]

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
        checked ? 'bg-app-accent' : 'bg-zinc-700'
      }`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`} />
    </button>
  )
}

function LockIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1C8.676 1 6 3.676 6 7v1H4v15h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
    </svg>
  )
}

export default function Home() {
  const navigate = useNavigate()

  const [content, setContent]           = useState('')
  const [expiresIn, setExpiresIn]       = useState(259200)
  const [maxViews, setMaxViews]         = useState(1)
  const [pwdEnabled, setPwdEnabled]     = useState(false)
  const [password, setPassword]         = useState('')
  const [burnOnExpiry, setBurnOnExpiry] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  const handleCreate = async () => {
    if (!content.trim()) {
      setError('Please enter a secret message.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const key           = await generateKey()
      const encryptedData = await encrypt(content, key)
      const keyB64        = await keyToBase64url(key)

      const id = await apiCreateSecret({
        encryptedData,
        maxViews,
        expiresIn,
        password:            pwdEnabled ? password : '',
        isPasswordProtected: pwdEnabled && password.length > 0,
      })

      const secretUrl = `${window.location.origin}/secret/${id}#key=${keyB64}`
      navigate(`/created/${id}`, { state: { secretUrl, id } })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-app-bg py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-app-surface border border-app-border mb-5">
            <LockIcon size={24} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Hemme<span className="text-app-accent">lig</span>
          </h1>
          <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">
            Share secrets securely with encrypted messages that automatically{' '}
            <span className="text-app-accent">self-destruct</span> after being read.
          </p>
        </div>

        {/* Compose card */}
        <div className="card mb-4">
          <div className="p-4">
            <textarea
              className="input-field min-h-[180px] leading-relaxed"
              placeholder="Type your secret here… it will be encrypted in your browser before being sent."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <div className="text-right mt-2">
              <span className="text-xs text-app-muted">{content.length} characters</span>
            </div>
          </div>

          <div className="border-t border-app-border px-4 py-3 flex items-center gap-2">
            <span className="text-app-muted text-sm font-mono">#</span>
            <input
              type="text"
              className="input-field"
              placeholder="Optional title (not encrypted)"
            />
          </div>

          {error && (
            <div className="border-t border-red-900/40 px-4 py-3 bg-red-950/20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="border-t border-app-border px-4 py-3 flex justify-end">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
              {loading ? 'Encrypting…' : 'Create'}
            </button>
          </div>
        </div>

        {/* Security card */}
        <div className="card">
          <div className="px-5 py-4 flex items-center justify-between border-b border-app-border">
            <div>
              <h2 className="font-semibold text-zinc-100">Security</h2>
              <p className="text-xs text-app-muted mt-0.5">Configure security settings for your secret</p>
            </div>
          </div>

          {/* Expiration + Max views */}
          <div className="grid grid-cols-2 gap-px bg-app-border">
            <div className="bg-app-surface px-5 py-4">
              <div className="section-label mb-3">
                <span className="icon-badge bg-blue-950/60 text-blue-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm.5-13H11v6l4.75 2.85.75-1.23-4-2.37V7z"/>
                  </svg>
                </span>
                Expiration
              </div>
              <select
                value={expiresIn}
                onChange={e => setExpiresIn(Number(e.target.value))}
                className="w-full bg-app-raised border border-app-border rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-app-accent cursor-pointer"
              >
                {EXPIRY_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <p className="text-xs text-app-muted mt-2">How long the secret stays available</p>
            </div>

            <div className="bg-app-surface px-5 py-4">
              <div className="section-label mb-3">
                <span className="icon-badge bg-teal-950/60 text-app-accent">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </span>
                Max views
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={maxViews}
                  onChange={e => setMaxViews(Number(e.target.value))}
                  className="flex-1 accent-app-accent cursor-pointer h-1.5"
                />
                <span className="text-sm font-mono text-zinc-200 w-8 text-right shrink-0">{maxViews}</span>
              </div>
              <p className="text-xs text-app-muted mt-2">Secret burns after this many views</p>
            </div>
          </div>

          {/* Password protection */}
          <div className="px-5 py-4 flex items-center justify-between border-t border-app-border">
            <div className="section-label">
              <span className="icon-badge bg-purple-950/60 text-purple-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </span>
              Password Protection
            </div>
            <Toggle checked={pwdEnabled} onChange={setPwdEnabled} />
          </div>

          {pwdEnabled && (
            <div className="px-5 pb-4 border-t border-app-border pt-4">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter a passphrase for this secret…"
                className="w-full bg-app-raised border border-app-border rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder:text-app-muted focus:outline-none focus:border-app-accent"
              />
              <p className="text-xs text-app-muted mt-2">
                Recipients will need this passphrase in addition to the secret URL.
              </p>
            </div>
          )}

          {/* Burn on expiry */}
          <div className="px-5 py-4 flex items-center justify-between border-t border-app-border">
            <div className="section-label">
              <span className="icon-badge bg-orange-950/60 text-orange-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
                </svg>
              </span>
              Burn after time expires
            </div>
            <Toggle checked={burnOnExpiry} onChange={setBurnOnExpiry} />
          </div>

          {/* Bottom create */}
          <div className="border-t border-app-border px-5 py-4 flex justify-center">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-8"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
              {loading ? 'Encrypting…' : 'Create'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-app-muted mt-6">
          Your secret is encrypted in your browser. The server never sees the plaintext.
        </p>
      </div>
    </div>
  )
}
