import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5ee',
          100: '#ffe6d4',
          200: '#ffc8a0',
          300: '#ffa364',
          400: '#ff8a3d',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        ink: {
          900: '#0f0f10',
          800: '#1a1a1c',
          700: '#2a2a2d',
          600: '#3f3f46',
        },
        canvas: '#f5f5f7',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 8px 24px -8px rgb(0 0 0 / 0.08)',
        card: '0 1px 2px 0 rgb(0 0 0 / 0.03), 0 4px 16px -6px rgb(0 0 0 / 0.06)',
        'brand-ring':
          '0 0 0 1.5px #f97316, 0 6px 18px -6px rgb(249 115 22 / 0.45)',
      },
    },
  },
  plugins: [],
};

export default config;
