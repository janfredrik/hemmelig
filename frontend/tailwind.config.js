/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'app-bg':      '#0c0c0c',
        'app-surface': '#161616',
        'app-raised':  '#1e1e1e',
        'app-border':  '#282828',
        'app-accent':  '#00b8a9',
        'app-muted':   '#555555',
      },
    },
  },
  plugins: [],
}
