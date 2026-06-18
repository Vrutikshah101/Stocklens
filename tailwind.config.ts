import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: 'var(--color-bg-base)',
        surface: 'var(--color-bg-surface)',
        elevated: 'var(--color-bg-elevated)',
        border: 'var(--color-border)',
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
        accent: 'var(--color-accent-blue)',
        gain: 'var(--color-green)',
        loss: 'var(--color-red)',
        warn: 'var(--color-amber)',
        ai: 'var(--color-purple)',
        teal: 'var(--color-teal)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        panel: '0 14px 40px rgba(0, 0, 0, 0.28)',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%': { transform: 'scale(1.08)', opacity: '0' },
          '100%': { transform: 'scale(1.08)', opacity: '0' },
        },
      },
      animation: {
        'pulse-ring': 'pulseRing 1s ease-out 2',
      },
    },
  },
  plugins: [],
}

export default config
