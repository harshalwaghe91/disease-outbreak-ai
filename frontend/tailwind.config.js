/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#102a43',
        teal: { 50: '#ecfdfb', 100: '#ccfbf1', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e' },
      },
      boxShadow: { soft: '0 18px 45px -24px rgba(15, 118, 110, 0.35)' },
    },
  },
  plugins: [],
}

