import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { generateKey, keyToBase64url, encrypt, cryptoAvailable } from '../crypto'
import { apiCreateSecret } from '../api'
import { useLang } from '../i18n'
import Layout from '../components/Layout'
import { AlertIcon, ArrowRightIcon, CheckIcon, FlameIcon, LockIcon, MinusIcon, PlusIcon, ShieldIcon, Spinner } from '../components/Icons'

export const EXPIRY_OPTIONS = [3600, 21600, 86400, 259200, 604800, 2592000] as const
export type Expiry = typeof EXPIRY_OPTIONS[number]

const MAX_VIEWS = 100

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-11 h-[26px] rounded-full transition-colors duration-200 shrink-0 ${
        checked ? 'bg-app-accent' : 'bg-app-border'
      }`}
    >
      <span className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
        checked ? 'translate-x-[18px]' : 'translate-x-0'
      }`} />
    </button>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLang()
  const burned = (location.state as { burned?: boolean } | null)?.burned

  const [content, setContent]       = useState('')
  const [expiresIn, setExpiresIn]   = useState<Expiry>(259200)
  const [maxViews, setMaxViews]     = useState(1)
  const [pwdEnabled, setPwdEnabled] = useState(false)
  const [password, setPassword]     = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<'' | 'empty' | 'passphrase' | 'insecure' | string>('')

  const handleCreate = async () => {
    if (loading) return
    if (!content.trim()) return setError('empty')
    if (pwdEnabled && !password) return setError('passphrase')
    if (!cryptoAvailable()) return setError('insecure')

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
        password: pwdEnabled ? password : '',
        isPasswordProtected: pwdEnabled,
      })

      const secretUrl = `${window.location.origin}/secret/${id}#key=${keyB64}`
      navigate(`/created/${id}`, {
        state: { secretUrl, expiresIn, maxViews, isPasswordProtected: pwdEnabled },
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : t('home.err.generic'))
      setLoading(false)
    }
  }

  const errorText =
    error === 'empty' ? t('home.err.empty') :
    error === 'passphrase' ? t('home.err.passphrase') :
    error === 'insecure' ? t('err.insecure') : error

  return (
    <Layout>
      <div className="rise max-w-[720px] mx-auto flex flex-col gap-6 sm:gap-8">

        {burned && (
          <p role="status" className="flex items-center justify-center gap-2 rounded-[10px] bg-app-success-soft px-4 py-3 text-sm font-medium text-app-success">
            <CheckIcon /> {t('home.burned')}
          </p>
        )}

        <h1 className="display text-center text-[36px] sm:text-[52px] pt-2 sm:pt-6">
          <span className="sm:block">{t('home.title.a')}</span>{' '}
          <span className="sm:block text-app-muted">{t('home.title.b')}</span>
        </h1>

        <section className="card overflow-hidden">
          <div className="transition-shadow focus-within:shadow-[inset_0_0_0_2px_rgb(var(--c-accent))] rounded-t-[14px]">
            <div className="flex items-center justify-between gap-4 px-5 sm:px-6 pt-5">
              <label htmlFor="secret" className="text-[15px] font-semibold">{t('home.secret')}</label>
              <span className="text-[13px] text-app-muted">
                <span className="font-mono tabular-nums">{content.length}</span> {content.length === 1 ? t('home.chars.one') : t('home.chars.other')}
              </span>
            </div>
            <textarea
              id="secret"
              value={content}
              onChange={e => { setContent(e.target.value); setError('') }}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleCreate() }}
              placeholder={t('home.placeholder')}
              aria-invalid={error === 'empty'}
              className="block w-full min-h-[150px] sm:min-h-[170px] px-5 sm:px-6 pt-3 pb-5 bg-transparent font-mono text-[15px] leading-[1.7] resize-y focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-5 px-5 sm:px-6 py-5 border-t border-app-border">
            <fieldset className="flex flex-col gap-2">
              <legend className="field-label mb-2">{t('home.expires')}</legend>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {EXPIRY_OPTIONS.map(v => (
                  <label
                    key={v}
                    className="relative flex items-center justify-center h-10 px-1 rounded-[9px] border text-sm whitespace-nowrap cursor-pointer select-none transition-colors
                               border-app-border bg-app-surface text-app-ink hover:bg-app-subtle
                               has-[:checked]:border-app-accent has-[:checked]:bg-app-accent-soft has-[:checked]:text-app-accent has-[:checked]:font-semibold
                               has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[rgb(var(--c-accent))]"
                  >
                    <input
                      type="radio"
                      name="expiry"
                      value={v}
                      checked={v === expiresIn}
                      onChange={() => setExpiresIn(v)}
                      className="sr-only"
                    />
                    {t(`expiry.${v}` as never)}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 pt-4 border-t border-app-border">
              <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold" id="views-label">{t('home.views')}</span>
                  <span className="text-[13px] text-app-muted">{t('home.viewsHint')}</span>
                </div>
                <div className="flex items-center h-10 rounded-[9px] border border-app-border bg-app-surface transition-[border-color,box-shadow] focus-within:border-app-accent focus-within:ring-[3px] focus-within:ring-app-accent/20" role="group" aria-labelledby="views-label">
                  <button
                    type="button"
                    aria-label={t('home.fewer')}
                    disabled={maxViews <= 1}
                    onClick={() => setMaxViews(v => Math.max(1, v - 1))}
                    className="w-10 h-full flex items-center justify-center rounded-l-[9px] text-app-muted hover:text-app-ink hover:bg-app-subtle transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                  ><MinusIcon size={14} /></button>
                  <input
                    type="number"
                    min={1}
                    max={MAX_VIEWS}
                    value={maxViews}
                    aria-label={t('home.views')}
                    onFocus={e => e.target.select()}
                    onChange={e => setMaxViews(Math.min(MAX_VIEWS, Math.max(1, Number(e.target.value) || 1)))}
                    className="w-9 bg-transparent text-center font-mono text-[15px] font-medium tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    aria-label={t('home.more')}
                    disabled={maxViews >= MAX_VIEWS}
                    onClick={() => setMaxViews(v => Math.min(MAX_VIEWS, v + 1))}
                    className="w-10 h-full flex items-center justify-center rounded-r-[9px] text-app-muted hover:text-app-ink hover:bg-app-subtle transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                  ><PlusIcon size={14} /></button>
                </div>
              </div>

              <label className="flex items-center justify-between gap-3 w-full sm:w-auto cursor-pointer select-none">
                <span className="text-sm font-semibold" id="pass-label">{t('home.passphrase')}</span>
                <Switch checked={pwdEnabled} onChange={v => { setPwdEnabled(v); setError('') }} label={t('home.passphrase')} />
              </label>
            </div>

            {pwdEnabled && (
              <div className="rise flex flex-col gap-1.5">
                <input
                  id="pass"
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  placeholder={t('home.passphrasePlaceholder')}
                  aria-labelledby="pass-label"
                  aria-describedby="pass-hint"
                  autoFocus
                  aria-invalid={error === 'passphrase'}
                  className="field font-mono"
                />
                <span id="pass-hint" className="text-[13px] text-app-muted">{t('home.passphraseHint')}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 px-5 sm:px-6 pb-5 sm:pb-6">
            <p role="alert" className="empty:hidden flex items-start gap-2 rounded-[10px] bg-app-danger-soft px-3.5 py-2.5 text-sm text-app-danger">
              {errorText && <><AlertIcon size={16} className="shrink-0 mt-0.5" />{errorText}</>}
            </p>
            <button onClick={handleCreate} disabled={loading} className="btn-primary h-12 text-base">
              {loading ? <><Spinner /> {t('home.submitting')}</> : <>{t('home.submit')} <ArrowRightIcon size={18} /></>}
            </button>
          </div>
        </section>

        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {([
            { icon: <LockIcon size={16} />,   i: 1 },
            { icon: <ShieldIcon size={16} />, i: 2 },
            { icon: <FlameIcon size={16} />,  i: 3 },
          ] as const).map(({ icon, i }) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 w-7 h-7 shrink-0 rounded-full bg-app-accent-soft text-app-accent flex items-center justify-center">{icon}</span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">{t(`home.fine.${i}.t` as never)}</span>
                <span className="text-[13px] leading-normal text-app-muted">{t(`home.fine.${i}.b` as never)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}
