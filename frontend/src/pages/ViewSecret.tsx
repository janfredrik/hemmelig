import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { base64urlToKey, decrypt } from '../crypto'
import { apiGetMeta, apiReveal, SecretMeta } from '../api'

function LockClosedIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1C8.676 1 6 3.676 6 7v1H4v15h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
    </svg>
  )
}

function LockOpenIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1C8.676 1 6 3.676 6 7H8c0-2.276 1.724-4 4-4s4 1.724 4 4v1H4v15h16V8H6V7c0-3.324 2.676-6 6-6zm0 11a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
    </svg>
  )
}

type State =
  | { phase: 'loading' }
  | { phase: 'locked'; meta: SecretMeta }
  | { phase: 'unlocked'; content: string }
  | { phase: 'burned' }
  | { phase: 'error'; message: string }

export default function ViewSecret() {
  const { id }     = useParams<{ id: string }>()
  const location   = useLocation()
  const keyB64     = new URLSearchParams(location.hash.replace('#', '')).get('key') ?? ''

  const [state, setState]       = useState<State>({ phase: 'loading' })
  const [password, setPassword] = useState('')
  const [revealing, setRevealing] = useState(false)
  const [pwdError, setPwdError] = useState('')
  const [copied, setCopied]     = useState(false)

  useEffect(() => {
    if (!id) {
      setState({ phase: 'error', message: 'Invalid secret URL.' })
      return
    }
    if (!keyB64) {
      setState({ phase: 'error', message: 'Decryption key missing from URL. Make sure you copied the full link.' })
      return
    }
    apiGetMeta(id)
      .then(meta => setState({ phase: 'locked', meta }))
      .catch(e => {
        const msg = e instanceof Error ? e.message : 'Secret not found.'
        if (msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('burned') || msg.toLowerCase().includes('not found')) {
          setState({ phase: 'burned' })
        } else {
          setState({ phase: 'error', message: msg })
        }
      })
  }, [id, keyB64])

  const handleReveal = async () => {
    if (!id || !keyB64) return
    setRevealing(true)
    setPwdError('')
    try {
      const encryptedData = await apiReveal(id, password || undefined)
      const key           = await base64urlToKey(keyB64)
      const plaintext     = await decrypt(encryptedData, key)
      setState({ phase: 'unlocked', content: plaintext })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to unlock secret.'
      if (msg.toLowerCase().includes('password') || msg.toLowerCase().includes('unauthorized')) {
        setPwdError('Incorrect password. Please try again.')
      } else if (msg.toLowerCase().includes('burned') || msg.toLowerCase().includes('not found')) {
        setState({ phase: 'burned' })
      } else {
        setPwdError(msg)
      }
    } finally {
      setRevealing(false)
    }
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Loading ──
  if (state.phase === 'loading') {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-app-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-app-muted text-sm">Loading secret…</p>
        </div>
      </div>
    )
  }

  // ── Burned / expired ──
  if (state.phase === 'burned') {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center px-4">
        <div className="card w-full max-w-md text-center p-10">
          <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-app-border flex items-center justify-center mx-auto mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#555">
              <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-zinc-300 mb-2">Secret Destroyed</h1>
          <p className="text-zinc-500 text-sm">This secret has already been viewed or has expired.</p>
          <Link to="/" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-app-raised border border-app-border rounded-lg text-sm text-zinc-300 hover:border-zinc-600 transition-colors">
            Create a new secret
          </Link>
        </div>
      </div>
    )
  }

  // ── Error ──
  if (state.phase === 'error') {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center px-4">
        <div className="card w-full max-w-md text-center p-10">
          <div className="w-14 h-14 rounded-xl bg-red-950/40 border border-red-900/30 flex items-center justify-center mx-auto mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#f87171">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-zinc-300 mb-2">Something went wrong</h1>
          <p className="text-zinc-500 text-sm">{state.message}</p>
          <Link to="/" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-app-raised border border-app-border rounded-lg text-sm text-zinc-300 hover:border-zinc-600 transition-colors">
            Go home
          </Link>
        </div>
      </div>
    )
  }

  // ── Unlocked ──
  if (state.phase === 'unlocked') {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-app-border">
              <span className="icon-badge bg-emerald-950/60 text-emerald-400">
                <LockOpenIcon size={16} />
              </span>
              <h1 className="font-semibold text-zinc-100">Decrypted Secret</h1>
              <div className="flex-1" />
              <button
                onClick={() => handleCopy(state.content)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-app-raised border border-app-border rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors"
              >
                {copied ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="p-5">
              <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-200 leading-relaxed break-words">
                {state.content}
              </pre>
            </div>
            <div className="border-t border-app-border px-5 py-4 bg-emerald-950/10">
              <p className="text-xs text-emerald-600/80 flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1C8.676 1 6 3.676 6 7v1H4v15h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
                </svg>
                This secret has been viewed and may now be destroyed depending on the max views setting.
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-app-muted hover:text-zinc-400 transition-colors">
              Create your own secret →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Locked ──
  const { meta } = state
  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <div className="card overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-app-border">
            <span className="icon-badge bg-yellow-950/60 text-yellow-500">
              <LockClosedIcon size={16} />
            </span>
            <h1 className="font-semibold text-zinc-100">Encrypted Secret</h1>
            <div className="flex-1" />
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-app-raised border border-app-border rounded-md">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#555">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              <span className="text-xs font-mono text-zinc-500">{meta.remainingViews}</span>
            </div>
          </div>

          {/* Unlock area */}
          <div className="flex flex-col items-center py-14 px-6">
            {meta.isPasswordProtected && (
              <div className="w-full max-w-xs mb-8">
                <label className="block text-xs text-zinc-500 mb-2">Passphrase required</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleReveal()}
                  placeholder="Enter passphrase…"
                  autoFocus
                  className="w-full bg-app-raised border border-app-border rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder:text-app-muted focus:outline-none focus:border-app-accent"
                />
                {pwdError && <p className="text-red-400 text-xs mt-2">{pwdError}</p>}
              </div>
            )}

            <button
              onClick={handleReveal}
              disabled={revealing || (meta.isPasswordProtected && !password)}
              className="flex items-center gap-3 px-8 py-4 bg-app-accent hover:bg-[#00a99b] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-base font-bold text-black transition-all duration-150"
            >
              {revealing ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <LockOpenIcon size={20} />
              )}
              {revealing ? 'Decrypting…' : 'Unlock Secret'}
            </button>

            {!pwdError && (
              <p className="text-app-muted text-sm mt-4">
                {meta.remainingViews === 1
                  ? 'This secret can only be viewed 1 more time'
                  : `This secret can be viewed ${meta.remainingViews} more times`}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
