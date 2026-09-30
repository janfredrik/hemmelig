/** @type {import('tailwindcss').Config} */
const token = name => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'app-bg':           token('bg'),
        'app-surface':      token('surface'),
        'app-subtle':       token('subtle'),
        'app-border':       token('border'),
        'app-ink':          token('ink'),
        'app-muted':        token('muted'),
        'app-accent':       token('accent'),
        'app-on-accent':    token('on-accent'),
        'app-accent-soft':  token('accent-soft'),
        'app-success':      token('success'),
        'app-success-soft': token('success-soft'),
        'app-danger':       token('danger'),
        'app-danger-soft':  token('danger-soft'),
      },
      fontFamily: {
        sans: ['"Schibsted Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Azeret Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
