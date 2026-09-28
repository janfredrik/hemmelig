/** @type {import('tailwindcss').Config} */
const token = name => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'app-bg':          token('bg'),
        'app-surface':     token('surface'),
        'app-raised':      token('raised'),
        'app-border':      token('border'),
        'app-ink':         token('ink'),
        'app-muted':       token('muted'),
        'app-accent':      token('accent'),
        'app-on-accent':   token('on-accent'),
        'app-accent-soft': token('accent-soft'),
        'app-ember':       token('ember'),
        'app-ember-soft':  token('ember-soft'),
        'app-track':       token('track'),
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans:  ['Geist', 'system-ui', 'sans-serif'],
        mono:  ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
