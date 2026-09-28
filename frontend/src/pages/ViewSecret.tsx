import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { base64urlToKey, decrypt } from '../crypto'
import { apiGetMeta, apiReveal, SecretMeta } from '../api'
import Layout from '../components/Layout'
import {
  AlertIcon, ArrowRightIcon, CheckIcon, ClockIcon, CopyIcon, EyeIcon, FlameIcon, LockKeyholeIcon, Spinner, UnlockIcon,
} from '../components/Icons'

type State =
  | { phase: 'loading' }
  | { phase: 'locked'; meta: SecretMeta }
  | { phase: 'unlocked'; content: string; remainingViews: number }
  | { phase: 'burned' }
  | { phase: 'error'; message: string }

function timeLeft(expiresAt: string): string | null {
  const ms = new Date(expiresAt).getTime() - Date.now()
  if (!Number.isFinite(ms) || ms <= 0) return null
  const minutes = Math.round(ms / 60000)
  if (minutes < 60) return minutes <= 1 ? 'Expires in a minute' : `Expires in ${minutes} minutes`
  const hours = Math.round(minutes / 60)
  if (hours < 48) return hours === 1 ? 'Expires in 1 hour' : `Expires in ${hours} hours`
  return `Expires in ${Math.round(hours / 24)} days`
}

function StatusCard({ icon, title, body, action }: { icon: React.ReactNode; title: string; body: string; action: string }) {
  return (
    <Layout center>
      <div className="card w-full max-w-[480px] p-10 flex flex-col items-center gap-4 text-center">
        {icon}
        <h1 className="display text-4xl">{title}</h1>
        <p className="text-[15px] leading-relaxed text-app-muted">{body}</p>
        <Link to="/" className="btn-outline mt-2">{action}</Link>
      </div>
    </Layout>
  )
}

export default function ViewSecret() {
  const { id }   = useParams<{ id: string }>()
  const location = useLocation()
  const keyB64   = new URLSearchParams(location.hash.replace('#', '')).get('key') ?? ''

  const [state, setState]         = useState<State>({ phase: 'loading' })
  const [password, setPassword]   = useState('')
  const [revealing, setRevealing] = useState(false)
  const [pwdError, setPwdError]   = useState('')
  const [copied, setCopied]       = useState(false)

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
    if (!id || !keyB64 || state.phase !== 'locked') return
    setRevealing(true)
    setPwdError('')
    try {
      const encryptedData = await apiReveal(id, password || undefined)
      const key           = await base64urlToKey(keyB64)
      const plaintext     = await decrypt(encryptedData, key)
      setState({ phase: 'unlocked', content: plaintext, remainingViews: state.meta.remainingViews - 1 })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to unlock secret.'
      if (msg.toLowerCase().includes('password') || msg.toLowerCase().includes('unauthorized')) {
        setPwdError('Incorrect passphrase. Please try again.')
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
      <Layout center>
        <div className="flex flex-col items-center gap-4 text-app-muted">
          <Spinner className="w-8 h-8 text-app-accent" />
          <p className="text-sm">Loading secret…</p>
        </div>
      </Layout>
    )
  }

  // ── Burned / expired ──
  if (state.phase === 'burned') {
    return (
      <StatusCard
        icon={<span className="w-16 h-16 rounded-full bg-app-raised border border-app-border text-app-muted flex items-center justify-center"><FlameIcon size={26} /></span>}
        title="Already gone."
        body="This secret has been viewed or has expired, and no longer exists."
        action="Create a new secret"
      />
    )
  }

  // ── Error ──
  if (state.phase === 'error') {
    return (
      <StatusCard
        icon={<span className="w-16 h-16 rounded-full bg-app-ember-soft text-app-ember flex items-center justify-center"><AlertIcon size={26} /></span>}
        title="Something went wrong."
        body={state.message}
        action="Go home"
      />
    )
  }

  // ── Unlocked ──
  if (state.phase === 'unlocked') {
    const destroyed = state.remainingViews <= 0
    return (
      <Layout center>
        <div className="w-full max-w-[760px] flex flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-3">
              <span className="eyebrow">Decrypted in your browser</span>
              <h1 className="display text-5xl sm:text-[52px]">Here’s your secret.</h1>
            </div>
            <button onClick={() => handleCopy(state.content)} className="btn-accent shrink-0">
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="card overflow-hidden">
            <pre className="m-0 px-6 py-7 font-mono text-[15px] leading-[1.8] whitespace-pre-wrap break-words">
              {state.content}
            </pre>
          </div>

          <div
            className={`flex items-center gap-3.5 px-5 py-4 rounded-[14px] text-sm font-medium ${
              destroyed ? 'bg-app-ember-soft text-app-ember' : 'bg-app-accent-soft text-app-accent'
            }`}
          >
            {destroyed ? <FlameIcon size={18} /> : <EyeIcon size={18} />}
            <span>
              {destroyed
                ? 'That was the last view — this secret is now destroyed. Save what you need before closing the tab.'
                : `This secret can be viewed ${state.remainingViews} more ${state.remainingViews === 1 ? 'time' : 'times'}.`}
            </span>
          </div>

          <Link to="/" className="self-center h-11 inline-flex items-center gap-2 text-[15px] font-medium text-app-accent hover:text-app-ink transition-colors">
            Create your own secret <ArrowRightIcon />
          </Link>
        </div>
      </Layout>
    )
  }

  // ── Locked ──
  const { meta } = state
  const expiry   = timeLeft(meta.expiresAt)
  return (
    <Layout center>
      <div className="card w-full max-w-[520px] p-6 sm:p-10 flex flex-col gap-7 rounded-3xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="w-[72px] h-[72px] rounded-full bg-app-ink text-app-bg flex items-center justify-center">
            <LockKeyholeIcon size={30} />
          </span>
          <span className="eyebrow">Someone sent you a secret</span>
          <h1 className="display text-5xl sm:text-[52px]">Open it once.</h1>
          <p className="text-[15px] leading-relaxed text-app-muted">
            This message can be viewed{' '}
            <span className="text-app-ink font-semibold">
              {meta.remainingViews === 1 ? '1 more time' : `${meta.remainingViews} more times`}
            </span>
            . After that it’s destroyed for good.
          </p>
        </div>

        {meta.isPasswordProtected && (
          <div className="flex flex-col gap-2">
            <label htmlFor="pass" className="text-sm font-semibold">Passphrase</label>
            <input
              id="pass"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleReveal()}
              placeholder="Enter the passphrase you were given"
              autoFocus
              aria-invalid={!!pwdError}
              className={`field h-[52px] rounded-xl px-4 text-[15px] ${pwdError ? 'border-app-ember' : ''}`}
            />
            {pwdError && <p role="alert" className="text-sm text-app-ember">{pwdError}</p>}
          </div>
        )}
        {!meta.isPasswordProtected && pwdError && (
          <p role="alert" className="text-sm text-app-ember text-center">{pwdError}</p>
        )}

        <button
          onClick={handleReveal}
          disabled={revealing || (meta.isPasswordProtected && !password)}
          className="btn-accent h-14 rounded-[14px] text-base"
        >
          {revealing ? <Spinner /> : <UnlockIcon size={18} />}
          {revealing ? 'Decrypting…' : 'Unlock secret'}
        </button>

        <div className="flex flex-wrap justify-center gap-5 text-[13px] text-app-muted">
          {expiry && <span className="flex items-center gap-1.5"><ClockIcon size={14} />{expiry}</span>}
          <span className="flex items-center gap-1.5">
            <EyeIcon size={14} />
            {meta.remainingViews === 1 ? '1 view left' : `${meta.remainingViews} views left`}
          </span>
        </div>
      </div>
    </Layout>
  )
}
