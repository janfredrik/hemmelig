import { useState } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { apiBurn } from '../api'

export default function SecretCreated() {
  const { id }     = useParams<{ id: string }>()
  const location   = useLocation()
  const navigate   = useNavigate()
  const secretUrl: string = (location.state as { secretUrl?: string })?.secretUrl ?? ''

  const [copied, setCopied]   = useState(false)
  const [burning, setBurning] = useState(false)

  const handleCopy = async () => {
    if (!secretUrl) return
    await navigator.clipboard.writeText(secretUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBurn = async () => {
    if (!id || !confirm('Permanently destroy this secret? This cannot be undone.')) return
    setBurning(true)
    await apiBurn(id)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="card overflow-hidden">

          {/* Success header */}
          <div className="flex flex-col items-center pt-10 pb-8 px-8">
            <div className="w-16 h-16 rounded-xl bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100 mb-2">Secret Created!</h1>
            <p className="text-zinc-500 text-sm text-center leading-relaxed max-w-sm">
              Your secret is ready to share. Keep the decryption key safe —
              it's embedded in the URL and cannot be recovered.
            </p>
          </div>

          {/* URL field */}
          <div className="px-6 pb-6">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Secret URL</p>
            {secretUrl ? (
              <div className="flex items-center gap-2 bg-app-raised border border-app-border rounded-lg px-3 py-2.5">
                <p className="flex-1 text-xs text-zinc-300 font-mono truncate">{secretUrl}</p>
                <button
                  onClick={handleCopy}
                  className="shrink-0 text-app-muted hover:text-app-accent transition-colors"
                  title="Copy URL"
                >
                  {copied ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                  )}
                </button>
              </div>
            ) : (
              <p className="text-sm text-zinc-500 italic">
                URL not available — please create a new secret.
              </p>
            )}
          </div>

          <div className="border-t border-app-border" />

          {/* Actions */}
          <div className="px-6 py-4 flex items-center gap-3 flex-wrap">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold text-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Create New Secret
            </Link>

            <div className="flex-1" />

            {secretUrl && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2.5 bg-app-accent hover:bg-[#00a99b] rounded-lg text-sm font-semibold text-black transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
                {copied ? 'Copied!' : 'Copy URL'}
              </button>
            )}

            <button
              onClick={handleBurn}
              disabled={burning}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-lg text-sm font-semibold text-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
              </svg>
              Burn Secret
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
