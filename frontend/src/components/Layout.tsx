import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LockIcon, MoonIcon, SunIcon } from './Icons'
import { Lang, useLang } from '../i18n'

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggle = () => {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch { /* storage unavailable */ }
    setDark(next)
  }

  return { dark, toggle }
}

const LANGS: { value: Lang; label: string; name: string }[] = [
  { value: 'en', label: 'EN', name: 'English' },
  { value: 'nb', label: 'NO', name: 'Norsk' },
]

export default function Layout({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  const { dark, toggle } = useTheme()
  const { lang, setLang, t } = useLang()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between gap-4 px-4 sm:px-10 h-16 border-b border-app-border bg-app-surface">
        <Link to="/" aria-label={t('nav.home')} className="flex items-center gap-2.5 text-app-ink">
          <span className="w-8 h-8 rounded-[9px] bg-app-accent text-app-on-accent flex items-center justify-center">
            <LockIcon size={16} />
          </span>
          <span className="text-[19px] font-semibold tracking-[-0.02em]">Hemmelig</span>
        </Link>

        <div className="flex items-center gap-2">
          <div role="group" aria-label={t('lang.label')} className="flex h-11 p-1 rounded-[10px] border border-app-border bg-app-subtle">
            {LANGS.map(l => (
              <button
                key={l.value}
                type="button"
                lang={l.value}
                aria-label={l.name}
                aria-pressed={lang === l.value}
                onClick={() => setLang(l.value)}
                className={`w-10 rounded-[7px] text-[13px] font-semibold transition-colors ${
                  lang === l.value ? 'bg-app-surface text-app-ink shadow-sm' : 'text-app-muted hover:text-app-ink'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={toggle}
            aria-label={dark ? t('theme.toLight') : t('theme.toDark')}
            className="w-11 h-11 rounded-[10px] border border-app-border bg-app-subtle text-app-ink flex items-center justify-center hover:border-app-muted transition-colors"
          >
            {dark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>
        </div>
      </header>

      <main className={`flex-1 px-4 sm:px-10 py-8 sm:py-12 ${center ? 'flex flex-col items-center justify-center' : ''}`}>
        {children}
      </main>
    </div>
  )
}
