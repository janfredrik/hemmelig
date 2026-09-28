import { useState } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { apiBurn } from '../api'
import Layout from '../components/Layout'
import { CheckIcon, CopyIcon, FlameIcon, PlusIcon } from '../components/Icons'

type CreatedState = {
  secretUrl?: string
  expiryLabel?: string
  maxViews?: number
  isPasswordProtected?: boolean
}

export default function SecretCreated() {
  const { id }   = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { secretUrl = '', expiryLabel, maxViews, isPasswordProtected } = (location.state as CreatedState) ?? {}

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

  const hashAt  = secretUrl.indexOf('#')
  const urlBase = hashAt >= 0 ? secretUrl.slice(0, hashAt) : secretUrl
  const urlKey  = hashAt >= 0 ? secretUrl.slice(hashAt) : ''

  const summary = [
    expiryLabel && { label: 'Expires', value: `In ${expiryLabel}` },
    maxViews && { label: 'Views', value: maxViews === 1 ? '1 view' : `${maxViews} views` },
    isPasswordProtected !== undefined && { label: 'Passphrase', value: isPasswordProtected ? 'Required' : 'None' },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <Layout center>
      <div className="w-full max-w-[680px] flex flex-col gap-8">

        <div className="flex flex-col gap-4">
          <span className="w-14 h-14 rounded-2xl bg-app-accent-soft text-app-accent flex items-center justify-center">
            <CheckIcon size={26} />
          </span>
          <h1 className="display text-5xl sm:text-6xl">Your link is ready.</h1>
          <p className="max-w-[520px] text-[15px] leading-relaxed text-app-muted">
            Share it through a channel you trust. The decryption key is the part after{' '}
            <span className="font-mono text-app-ink">#key=</span> — it can’t be recovered if lost.
          </p>
        </div>

        {secretUrl ? (
          <div className="card overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:pl-5">
              <p className="flex-1 min-w-0 truncate font-mono text-sm px-2 sm:px-0" title={secretUrl}>
                <span className="text-app-muted">{urlBase}</span>
                <span className="text-app-accent">{urlKey}</span>
              </p>
              <button onClick={handleCopy} className="btn-accent shrink-0">
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
            {summary.length > 0 && (
              <dl className="grid grid-cols-3 border-t border-app-border bg-app-raised divide-x divide-app-border">
                {summary.map(s => (
                  <div key={s.label} className="flex flex-col gap-1 px-5 py-4">
                    <dt className="text-xs text-app-muted">{s.label}</dt>
                    <dd className="text-[15px] font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        ) : (
          <div className="card px-5 py-4 text-sm text-app-muted">
            The link is no longer available on this page — please create a new secret.
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="btn-outline">
            <PlusIcon /> New secret
          </Link>
          <button onClick={handleBurn} disabled={burning} className="btn-ember">
            <FlameIcon /> {burning ? 'Burning…' : 'Burn now'}
          </button>
        </div>
      </div>
    </Layout>
  )
}
