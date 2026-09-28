import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateKey, keyToBase64url, encrypt } from '../crypto'
import { apiCreateSecret } from '../api'
import Layout from '../components/Layout'
import { ArrowRightIcon, ShieldIcon, Spinner } from '../components/Icons'

const EXPIRY_OPTIONS = [
  { label: '1 hour',  value: 3600 },
  { label: '6 hours', value: 21600 },
  { label: '1 day',   value: 86400 },
  { label: '3 days',  value: 259200 },
  { label: '7 days',  value: 604800 },
  { label: '30 days', value: 2592000 },
]

const MAX_VIEWS = 100

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-[46px] h-7 rounded-full transition-colors duration-200 shrink-0 ${
        checked ? 'bg-app-accent' : 'bg-app-track'
      }`}
    >
      <span className={`absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
        checked ? 'translate-x-[18px]' : 'translate-x-0'
      }`} />
    </button>
  )
}

const TRUST_POINTS = [
  { title: 'Encrypted in your browser', body: 'AES-256-GCM via the Web Crypto API.' },
  { title: 'The key stays in the link', body: 'It sits after the #, so it is never sent to the server.' },
  { title: 'Burns after reading',       body: 'Gone after the last view or when time runs out.' },
]

export default function Home() {
  const navigate = useNavigate()

  const [content, setContent]           = useState('')
  const [expiresIn, setExpiresIn]       = useState(259200)
  const [maxViews, setMaxViews]         = useState(1)
  const [pwdEnabled, setPwdEnabled]     = useState(false)
  const [password, setPassword]         = useState('')
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

      const isPasswordProtected = pwdEnabled && password.length > 0
      const id = await apiCreateSecret({
        encryptedData,
        maxViews,
        expiresIn,
        password: isPasswordProtected ? password : '',
        isPasswordProtected,
      })

      const secretUrl = `${window.location.origin}/secret/${id}#key=${keyB64}`
      const expiryLabel = EXPIRY_OPTIONS.find(o => o.value === expiresIn)?.label ?? ''
      navigate(`/created/${id}`, {
        state: { secretUrl, id, expiryLabel, maxViews, isPasswordProtected },
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-[1184px] mx-auto flex flex-col gap-10">

        {/* Hero */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12">
          <h1 className="display text-5xl sm:text-[76px] sm:leading-[0.95]">
            Passwords don’t belong <span className="italic text-app-muted">in chat history.</span>
          </h1>
          <p className="max-w-[360px] text-[15px] leading-relaxed text-app-muted">
            Your message is encrypted in this browser before it leaves. The key lives only in the
            link — the server never sees the plaintext.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-6 items-stretch">

          {/* Composer */}
          <section className="card flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-[18px] border-b border-app-border">
              <label htmlFor="secret" className="text-sm font-semibold">Your secret</label>
              <span className="font-mono text-xs text-app-muted">
                {content.length} {content.length === 1 ? 'character' : 'characters'}
              </span>
            </div>
            <textarea
              id="secret"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste a password, an API key, a private note…"
              className="flex-1 min-h-[300px] p-6 bg-transparent font-mono text-[15px] leading-[1.7] resize-none focus:outline-none"
            />
            <div className="flex items-center gap-3 px-6 py-4 border-t border-app-border">
              <span className="font-mono text-[15px] text-app-muted" aria-hidden="true">#</span>
              <label htmlFor="title" className="sr-only">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Optional title — not encrypted"
                className="flex-1 h-7 bg-transparent text-sm focus:outline-none"
              />
            </div>
            {error && (
              <div role="alert" className="px-6 py-3 border-t border-app-ember/40 bg-app-ember-soft text-app-ember text-sm">
                {error}
              </div>
            )}
            <div className="flex items-center gap-2.5 px-6 py-3.5 bg-app-raised border-t border-app-border text-[13px] text-app-muted">
              <ShieldIcon size={14} />
              Encrypted locally with a fresh 256-bit key before upload
            </div>
          </section>

          {/* Settings */}
          <section className="card p-6 flex flex-col gap-6">

            <fieldset className="flex flex-col gap-3">
              <legend className="text-sm font-semibold mb-3">Expires after</legend>
              <div className="grid grid-cols-3 gap-2">
                {EXPIRY_OPTIONS.map(o => {
                  const active = o.value === expiresIn
                  return (
                    <button
                      key={o.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setExpiresIn(o.value)}
                      className={`h-11 rounded-[10px] border text-sm transition-colors ${
                        active
                          ? 'bg-app-ink border-app-ink text-app-bg font-semibold'
                          : 'bg-app-raised border-app-border text-app-ink hover:border-app-muted'
                      }`}
                    >
                      {o.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold" id="views-label">Max views</span>
                <span className="text-[13px] text-app-muted">Burns after the last view</span>
              </div>
              <div className="flex items-center rounded-xl border border-app-border bg-app-raised" role="group" aria-labelledby="views-label">
                <button
                  type="button"
                  aria-label="Fewer views"
                  disabled={maxViews <= 1}
                  onClick={() => setMaxViews(v => Math.max(1, v - 1))}
                  className="w-11 h-11 text-lg disabled:opacity-40"
                >−</button>
                <input
                  type="number"
                  min={1}
                  max={MAX_VIEWS}
                  value={maxViews}
                  aria-label="Max views"
                  onChange={e => setMaxViews(Math.min(MAX_VIEWS, Math.max(1, Number(e.target.value) || 1)))}
                  className="w-10 bg-transparent text-center font-mono text-base font-medium focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  aria-label="More views"
                  disabled={maxViews >= MAX_VIEWS}
                  onClick={() => setMaxViews(v => Math.min(MAX_VIEWS, v + 1))}
                  className="w-11 h-11 text-lg disabled:opacity-40"
                >+</button>
              </div>
            </div>

            <div className="h-px bg-app-border" />

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Passphrase</span>
                <Toggle checked={pwdEnabled} onChange={setPwdEnabled} label="Passphrase protection" />
              </div>
              {pwdEnabled && (
                <>
                  <label htmlFor="pass" className="sr-only">Passphrase</label>
                  <input
                    id="pass"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Choose a passphrase"
                    autoFocus
                    className="field font-mono"
                  />
                  <span className="text-[13px] text-app-muted">Send it separately from the link.</span>
                </>
              )}
            </div>

            <button
              onClick={handleCreate}
              disabled={loading}
              className="btn-accent mt-auto h-14 rounded-[14px] text-base"
            >
              {loading ? <><Spinner /> Encrypting…</> : <>Encrypt &amp; create link <ArrowRightIcon size={18} /></>}
            </button>
          </section>
        </div>

        {/* Trust points */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {TRUST_POINTS.map((p, i) => (
            <div key={p.title} className="flex gap-3.5">
              <span className="font-serif text-[28px] leading-none text-app-accent">0{i + 1}</span>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold">{p.title}</span>
                <span className="text-[13px] leading-normal text-app-muted">{p.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
