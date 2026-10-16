import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0A2540',
          DEFAULT: '#0284C7',
          primary: '#0284C7',
          ocean: '#0284C7',
          sea: '#0369A1',
          teal: '#0EA5E9',
          light: '#38BDF8',
          mint: '#06B6D4',
          accent: '#0284C7',
          surface: '#F0F6FA',
          panel: '#FFFFFF',
          text: '#0F1E2E',
          muted: '#5B7083',
          border: '#DCE6EF',
          warning: '#D8A13A',
          danger: '#DC2626',
          success: '#10B981',
          info: '#0284C7',
        },
      },
      borderRadius: {
        'crm': '14px',
        'crm-sm': '10px',
        'crm-lg': '18px',
      },
      boxShadow: {
        'crm-soft': '0 2px 10px rgba(2, 132, 199, 0.06)',
        'crm-card': '0 4px 20px -2px rgba(2, 132, 199, 0.08)',
        'crm-modal': '0 20px 40px -8px rgba(10, 37, 64, 0.22)',
      },
      fontFamily: {
        sans: ['Be Vietnam Pro', 'Inter', 'SF Pro', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
