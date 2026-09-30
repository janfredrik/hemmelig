import { useState } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { apiBurn } from '../api'
import { copyText } from '../clipboard'
import { plural, useLang } from '../i18n'
import Layout from '../components/Layout'
import { CheckIcon, ClockIcon, CopyIcon, EyeIcon, FlameIcon, LockIcon, PlusIcon } from '../components/Icons'

type CreatedState = {
  secretUrl?: string
  expiresIn?: number
  maxViews?: number
  isPasswordProtected?: boolean
}

export default function SecretCreated() {
  const { id }   = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { t }    = useLang()
  const { secretUrl = '', expiresIn, maxViews, isPasswordProtected } = (location.state as CreatedState) ?? {}

  const [copied, setCopied]           = useState(false)
  const [copyFailed, setCopyFailed]   = useState(false)
  const [confirmBurn, setConfirmBurn] = useState(false)
  const [burning, setBurning]         = useState(false)
  const [burnError, setBurnError]     = useState(false)

  const handleCopy = async () => {
    if (!secretUrl) return
    const ok = await copyText(secretUrl)
    setCopyFailed(!ok)
    if (!ok) return
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBurn = async () => {
    if (!id) return
    setBurning(true)
    setBurnError(false)
    try {
      await apiBurn(id)
      navigate('/', { state: { burned: true } })
    } catch {
      setBurnError(true)
      setBurning(false)
      setConfirmBurn(false)
    }
  }

  const hashAt  = secretUrl.indexOf('#')
  const urlBase = hashAt >= 0 ? secretUrl.slice(0, hashAt) : secretUrl
  const urlKey  = hashAt >= 0 ? secretUrl.slice(hashAt) : ''

  const summary = [
    expiresIn && { icon: <ClockIcon size={15} />, label: t('created.expires'), value: t('created.in', { x: t(`expiry.${expiresIn}` as never) }) },
    maxViews && { icon: <EyeIcon size={15} />, label: t('created.views'), value: plural(t, 'created.view', maxViews) },
    isPasswordProtected !== undefined && { icon: <LockIcon size={15} />, label: t('created.passphrase'), value: isPasswordProtected ? t('created.required') : t('created.none') },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string }[]

  return (
    <Layout center>
      <div className="rise w-full max-w-[640px] flex flex-col gap-6">

        <div className="flex flex-col items-center gap-4 text-center">
          <span className="w-14 h-14 rounded-full bg-app-success-soft text-app-success flex items-center justify-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="check-draw" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <h1 className="display text-[32px] sm:text-[40px]">{t('created.title')}</h1>
          <p className="max-w-[48ch] text-[15px] leading-relaxed text-app-muted">
            {t('created.lede.a')} <span className="font-mono text-[13px] text-app-accent">#key=</span> {t('created.lede.b')}
          </p>
        </div>

        <section className="card overflow-hidden">
          {secretUrl ? (
            <>
              <div className="flex flex-col gap-3 p-5 sm:p-6">
                <span className="field-label">{t('created.link')}</span>
                <p className="px-3.5 py-3 rounded-[10px] bg-app-subtle border border-app-border break-all select-all font-mono text-[13.5px] leading-relaxed" title={secretUrl}>
                  <span className="text-app-muted">{urlBase}</span>
                  <span className="key-mark text-app-accent font-medium">{urlKey}</span>
                </p>
                <button onClick={handleCopy} className="btn-primary h-12 text-base">
                  {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
                  {copied ? t('created.copied') : t('created.copy')}
                </button>
                {copyFailed && <p role="alert" className="text-sm text-app-danger">{t('created.copyFailed')}</p>}
              </div>
              {summary.length > 0 && (
                <dl className="grid grid-cols-1 sm:grid-cols-3 border-t border-app-border bg-app-subtle/60 divide-y sm:divide-y-0 sm:divide-x divide-app-border">
                  {summary.map(s => (
                    <div key={s.label} className="flex sm:flex-col items-center sm:items-start justify-between gap-1 px-5 sm:px-6 py-3 sm:py-4">
                      <dt className="flex items-center gap-1.5 text-[13px] text-app-muted">{s.icon}{s.label}</dt>
                      <dd className="text-[15px] font-semibold">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </>
          ) : (
            <p className="p-5 sm:p-6 text-sm text-app-muted">{t('created.missing')}</p>
          )}
        </section>

        {burnError && <p role="alert" className="text-sm text-app-danger text-center">{t('created.burnFailed')}</p>}
        {confirmBurn ? (
          <div role="alertdialog" aria-labelledby="burn-ask" className="rise flex flex-wrap items-center gap-3 p-4 rounded-[14px] border border-app-danger/30 bg-app-danger-soft">
            <p id="burn-ask" className="flex-1 min-w-[18ch] text-sm font-medium text-app-danger">{t('created.burnAsk')}</p>
            <button onClick={() => setConfirmBurn(false)} disabled={burning} autoFocus className="btn-secondary">{t('created.cancel')}</button>
            <button onClick={handleBurn} disabled={burning} className="btn-danger">
              <FlameIcon /> {burning ? t('created.burning') : t('created.burnYes')}
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/" className="btn-secondary">
              <PlusIcon /> {t('created.new')}
            </Link>
            <button onClick={() => setConfirmBurn(true)} className="btn-danger-quiet">
              <FlameIcon /> {t('created.burn')}
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
