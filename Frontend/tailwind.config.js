/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Red/crimson accent (primary brand color from Auraform-style)
        primary: {
          50:  '#fff0f3',
          100: '#ffe0e8',
          200: '#ffc1d1',
          300: '#ff91aa',
          400: '#ff5578',
          500: '#ff1f4d',
          600: '#e8002d',
          700: '#c40025',
          800: '#a30022',
          900: '#870020',
          950: '#4b0010',
        },
        // Warm neutral palette (background / text)
        warm: {
          50:  '#FAF9F6',
          100: '#F5F3EE',
          200: '#EDE9E1',
          300: '#DDD8CE',
          400: '#BAB4A8',
          500: '#958E82',
          600: '#6B6560',
          700: '#4A4540',
          800: '#2E2A26',
          900: '#1A1714',
          950: '#0D0C0A',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in':   'fadeIn 0.3s ease-in-out',
        'slide-in':  'slideIn 0.3s ease-out',
        'slide-up':  'slideUp 0.4s ease-out',
        'blob-spin': 'blobSpin 20s linear infinite',
      },
      keyframes: {
        fadeIn:   { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideIn:  { '0%': { opacity: '0', transform: 'translateX(-16px)' },'100%': { opacity: '1', transform: 'translateX(0)' } },
        slideUp:  { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        blobSpin: { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
      },
      boxShadow: {
        'card':     '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)',
        'card-md':  '0 4px 6px rgba(0,0,0,0.05), 0 10px 30px rgba(0,0,0,0.08)',
        'card-lg':  '0 8px 16px rgba(0,0,0,0.06), 0 24px 48px rgba(0,0,0,0.1)',
        'accent':   '0 8px 32px rgba(220,0,45,0.25)',
        'accent-lg':'0 12px 48px rgba(220,0,45,0.35)',
        'pill':     '0 2px 8px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        'pill': '9999px',
        '2.5xl': '20px',
      },
    },
  },
  plugins: [],
}
