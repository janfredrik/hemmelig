import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LockIcon, MoonIcon, SunIcon } from './Icons'

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

export default function Layout({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  const { dark, toggle } = useTheme()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between gap-4 px-4 sm:px-12 py-4 sm:py-5 border-b border-app-border">
        <Link to="/" className="flex items-center gap-3 text-app-ink">
          <span className="w-9 h-9 rounded-[10px] bg-app-ink text-app-bg flex items-center justify-center">
            <LockIcon size={18} />
          </span>
          <span className="font-serif text-[28px] leading-none">Hemmelig</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline font-mono text-xs uppercase tracking-[0.06em] text-app-muted">
            Zero-knowledge · AES-256-GCM
          </span>
          <button
            onClick={toggle}
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="w-11 h-11 rounded-xl border border-app-border bg-app-surface text-app-ink flex items-center justify-center hover:border-app-muted transition-colors"
          >
            {dark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>
        </div>
      </header>

      <main className={`flex-1 px-4 sm:px-12 py-10 sm:py-14 ${center ? 'flex items-center justify-center' : ''}`}>
        {children}
      </main>
    </div>
  )
}
