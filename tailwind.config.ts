import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nude: {
          50:  '#fdfaf5',
          100: '#f8f2e8',
          200: '#f0e5d2',
          300: '#e6d4b8',
          400: '#d9c09a',
          500: '#c9a87c',
          600: '#b08d60',
          700: '#8f6f47',
          800: '#6b5035',
          900: '#4a3524',
        },
        gold: {
          light: '#e8d5a3',
          DEFAULT: '#c9a84c',
          dark:  '#a07830',
        },
        brown: {
          DEFAULT: '#3d2a1a',
          light:   '#5c4030',
          muted:   '#7a5c44',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans:  ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass:      '0 8px 32px rgba(160,120,48,0.10), inset 0 1px 0 rgba(255,255,255,0.6)',
        'glass-lg': '0 16px 48px rgba(160,120,48,0.15), inset 0 1px 0 rgba(255,255,255,0.7)',
        'gold-glow':'0 0 24px rgba(201,168,76,0.35)',
      },
      backdropBlur: {
        glass: '16px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'nude-gradient': 'linear-gradient(135deg, #fdfaf5 0%, #f0e5d2 40%, #e6d4b8 100%)',
        'gold-gradient': 'linear-gradient(135deg, #e8d5a3 0%, #c9a84c 50%, #a07830 100%)',
        'card-glass':    'linear-gradient(135deg, rgba(253,250,245,0.72) 0%, rgba(240,229,210,0.55) 100%)',
      },
    },
  },
  plugins: [],
}

export default config
