import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6d5cff',
          50: '#6d5cff10',
          100: '#6d5cff20',
          500: '#6d5cff',
          600: '#6d5cff',
          700: '#6d5cff',
        },
        secondary: {
          DEFAULT: '#a78bfa',
          500: '#a78bfa',
        },
        accent: {
          DEFAULT: '#34d399',
          500: '#34d399',
        },
        background: '#09090b',
        foreground: '#fafafa',
      },
      fontFamily: {
        heading: ['Satoshi', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
