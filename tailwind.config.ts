import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        deep: '#0A0A0F',
        card: '#12121A',
        raised: '#1A1A28',
        purple: '#7B5EA7',
        gold: '#C9A84C',
        'text-primary': '#E8E0F0',
        'text-secondary': '#9B93AB',
        muted: '#5A5468',
        teal: '#4ECDC4',
      },
      backdropBlur: {
        20: '20px',
      },
    },
  },
  plugins: [],
}

export default config
