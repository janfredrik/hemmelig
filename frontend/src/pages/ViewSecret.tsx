import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { base64urlToKey, decrypt, cryptoAvailable } from '../crypto'
import { copyText } from '../clipboard'
import { apiGetMeta, apiReveal, SecretMeta } from '../api'
import { plural, T, useLang } from '../i18n'
import Layout from '../components/Layout'
import {
  AlertIcon, ArrowRightIcon, CheckIcon, ClockIcon, CopyIcon, EyeIcon, FlameIcon, LockIcon, Spinner, UnlockIcon,
} from '../components/Icons'

type ErrorKey = 'view.err.invalid' | 'view.err.noKey' | 'view.err.badKey' | 'view.err.mismatch' | 'err.insecure'

type State =
  | { phase: 'loading' }
  | { phase: 'locked'; meta: SecretMeta }
  | { phase: 'unlocked'; content: string; remainingViews: number }
  | { phase: 'burned' }
  | { phase: 'error'; key?: ErrorKey; message?: string }

function timeLeft(t: T, expiresAt: string): string | null {
  const ms = new Date(expiresAt).getTime() - Date.now()
  if (!Number.isFinite(ms) || ms <= 0) return null
  const minutes = Math.round(ms / 60000)
  if (minutes < 60) return minutes <= 1 ? t('expiresIn.minute') : t('expiresIn.minutes', { n: minutes })
  const hours = Math.round(minutes / 60)
  if (hours < 48) return hours === 1 ? t('expiresIn.hour') : t('expiresIn.hours', { n: hours })
  return t('expiresIn.days', { n: Math.round(hours / 24) })
}

function StatusCard({ icon, title, body, action }: { icon: React.ReactNode; title: string; body: string; action: string }) {
  return (
    <Layout center>
      <div className="rise card w-full max-w-[460px] p-8 sm:p-10 flex flex-col items-center gap-4 text-center">
        {icon}
        <h1 className="display text-[28px] sm:text-[32px]">{title}</h1>
        <p className="text-[15px] leading-relaxed text-app-muted">{body}</p>
        <Link to="/" className="btn-secondary mt-2">{action}</Link>
      </div>
    </Layout>
  )
}

export default function ViewSecret() {
  const { id }   = useParams<{ id: string }>()
  const location = useLocation()
  const { t }    = useLang()
  const keyB64   = new URLSearchParams(location.hash.replace('#', '')).get('key') ?? ''

  const [state, setState]         = useState<State>({ phase: 'loading' })
  const [password, setPassword]   = useState('')
  const [revealing, setRevealing] = useState(false)
  const [pwdError, setPwdError]   = useState<'' | 'wrong' | string>('')
  const [copied, setCopied]       = useState(false)

  useEffect(() => {
    if (!id) return setState({ phase: 'error', key: 'view.err.invalid' })
    if (!keyB64) return setState({ phase: 'error', key: 'view.err.noKey' })
    if (!cryptoAvailable()) return setState({ phase: 'error', key: 'err.insecure' })
    apiGetMeta(id)
      .then(meta => setState({ phase: 'locked', meta }))
      .catch(e => {
        const msg = e instanceof Error ? e.message : 'Secret not found.'
        const lower = msg.toLowerCase()
        if (lower.includes('expired') || lower.includes('burned') || lower.includes('not found')) {
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
    // Import the key before revealing: a malformed key must fail before the server counts a view.
    let key: CryptoKey
    try {
      key = await base64urlToKey(keyB64)
    } catch {
      setState({ phase: 'error', key: 'view.err.badKey' })
      setRevealing(false)
      return
    }
    try {
      const encryptedData = await apiReveal(id, password || undefined)
      let plaintext: string
      try {
        plaintext = await decrypt(encryptedData, key)
      } catch {
        setState({ phase: 'error', key: 'view.err.mismatch' })
        return
      }
      setState({ phase: 'unlocked', content: plaintext, remainingViews: state.meta.remainingViews - 1 })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to unlock secret.'
      const lower = msg.toLowerCase()
      if (lower.includes('password') || lower.includes('unauthorized')) {
        setPwdError('wrong')
      } else if (lower.includes('burned') || lower.includes('expired') || lower.includes('not found')) {
        setState({ phase: 'burned' })
      } else {
        setPwdError(msg)
      }
    } finally {
      setRevealing(false)
    }
  }

  const handleCopy = async (text: string) => {
    if (!(await copyText(text))) return
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (state.phase === 'loading') {
    return (
      <Layout center>
        <div className="flex flex-col items-center gap-4 text-app-muted" role="status">
          <Spinner className="w-7 h-7 text-app-accent" />
          <p className="text-sm">{t('view.loading')}</p>
        </div>
      </Layout>
    )
  }

  if (state.phase === 'burned') {
    return (
      <StatusCard
        icon={<span className="w-14 h-14 rounded-full bg-app-subtle text-app-muted flex items-center justify-center"><FlameIcon size={24} /></span>}
        title={t('view.gone.title')}
        body={t('view.gone.body')}
        action={t('view.gone.action')}
      />
    )
  }

  if (state.phase === 'error') {
    return (
      <StatusCard
        icon={<span className="w-14 h-14 rounded-full bg-app-danger-soft text-app-danger flex items-center justify-center"><AlertIcon size={24} /></span>}
        title={t('view.error.title')}
        body={state.key ? t(state.key) : state.message ?? ''}
        action={t('view.error.action')}
      />
    )
  }

  const pwdErrorText = pwdError === 'wrong' ? t('view.wrongPass') : pwdError

  if (state.phase === 'unlocked') {
    const destroyed = state.remainingViews <= 0
    return (
      <Layout center>
        <div className="rise w-full max-w-[720px] flex flex-col gap-5">
          <section className="card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 sm:px-6 py-5 border-b border-app-border">
              <div className="flex flex-col gap-1">
                <h1 className="display text-[26px] sm:text-[30px]">{t('view.unlocked.title')}</h1>
                <p className="text-sm text-app-muted">{t('view.unlocked.sub')}</p>
              </div>
              <button onClick={() => handleCopy(state.content)} className="btn-primary shrink-0 w-full sm:w-auto">
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? t('view.copied') : t('view.copy')}
              </button>
            </div>
            <pre className="m-0 px-5 sm:px-6 py-6 font-mono text-[15px] leading-[1.75] whitespace-pre-wrap break-words">
              {state.content}
            </pre>
            <div
              role="status"
              className={`flex items-start gap-3 px-5 sm:px-6 py-4 border-t text-sm font-medium ${
                destroyed ? 'bg-app-danger-soft text-app-danger border-app-danger/20' : 'bg-app-accent-soft text-app-accent border-app-border'
              }`}
            >
              {destroyed ? <FlameIcon size={18} className="shrink-0" /> : <EyeIcon size={18} className="shrink-0" />}
              <span>{destroyed ? t('view.destroyed') : plural(t, 'view.remaining', state.remainingViews)}</span>
            </div>
          </section>

          <Link to="/" className="self-center h-11 inline-flex items-center gap-2 text-[15px] font-medium text-app-accent hover:underline underline-offset-4">
            {t('view.createOwn')} <ArrowRightIcon />
          </Link>
        </div>
      </Layout>
    )
  }

  const { meta } = state
  const expiry   = timeLeft(t, meta.expiresAt)
  return (
    <Layout center>
      <div className="rise card w-full max-w-[460px] p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="w-14 h-14 rounded-full bg-app-accent-soft text-app-accent flex items-center justify-center">
            <LockIcon size={24} />
          </span>
          <h1 className="display text-[28px] sm:text-[32px]">
            {meta.remainingViews === 1 ? t('view.locked.title.one') : t('view.locked.title.other')}
          </h1>
          <p className="text-[15px] leading-relaxed text-app-muted">
            {t('view.locked.body.a')}{' '}
            <span className="text-app-ink font-semibold">{plural(t, 'view.moreTimes', meta.remainingViews)}</span>
            {t('view.locked.body.b')} {t('view.locked.uses')}
          </p>
        </div>

        {meta.isPasswordProtected && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pass" className="field-label">{t('view.passphrase')}</label>
            <input
              id="pass"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setPwdError('') }}
              onKeyDown={e => e.key === 'Enter' && handleReveal()}
              placeholder={t('view.passphrasePlaceholder')}
              autoFocus
              aria-invalid={!!pwdError}
              className="field h-12"
            />
            {pwdErrorText && <p role="alert" className="text-sm text-app-danger">{pwdErrorText}</p>}
          </div>
        )}
        {!meta.isPasswordProtected && pwdErrorText && (
          <p role="alert" className="text-sm text-app-danger text-center">{pwdErrorText}</p>
        )}

        <button
          onClick={handleReveal}
          disabled={revealing || (meta.isPasswordProtected && !password)}
          className="btn-primary h-12 text-base"
        >
          {revealing ? <Spinner /> : <UnlockIcon size={18} />}
          {revealing ? t('view.opening') : t('view.open')}
        </button>

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-[13px] text-app-muted">
          {expiry && <span className="flex items-center gap-1.5"><ClockIcon size={14} />{expiry}</span>}
          <span className="flex items-center gap-1.5">
            <EyeIcon size={14} />
            {plural(t, 'view.viewsLeft', meta.remainingViews)}
          </span>
        </div>
      </div>
    </Layout>
  )
}
