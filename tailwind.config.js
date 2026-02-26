/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
          950: 'var(--primary-950)',
        },
        surface: {
          50: 'var(--surface-50)',
          100: 'var(--surface-100)',
          200: 'var(--surface-200)',
          300: 'var(--surface-300)',
          400: 'var(--surface-400)',
          500: 'var(--surface-500)',
          600: 'var(--surface-600)',
          700: 'var(--surface-700)',
          800: 'var(--surface-800)',
          900: 'var(--surface-900)',
          950: 'var(--surface-950)',
        },
        brand: {
          orange: '#F97316',
          'orange-light': '#FB923C',
          'orange-dark': '#EA580C',
          amber: '#F59E0B',
          'amber-light': '#FCD34D',
          yellow: '#EAB308',
          black: '#0A0A0A',
          'gray-dark': '#1A1A1A',
          'gray-mid': '#2A2A2A',
          'gray-soft': '#3A3A3A',
          green: '#22C55E',
          'green-dark': '#16A34A',
          cream: '#FFF7ED',
          'cream-dark': '#FED7AA',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      backgroundImage: {
        'auth-gradient': 'var(--auth-gradient)',
        'orange-glow': 'radial-gradient(ellipse at center, rgba(249,115,22,0.15) 0%, transparent 70%)',
        'primary-glow': 'radial-gradient(ellipse at center, var(--primary-500-op15) 0%, transparent 70%)',
      },
      boxShadow: {
        'primary-glow': '0 0 40px var(--primary-500-op25)',
        'orange-glow': '0 0 40px rgba(249,115,22,0.25)',
        'orange-sm': '0 0 20px rgba(249,115,22,0.15)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-primary': 'pulse-primary 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-primary': {
          '0%, 100%': { boxShadow: '0 0 20px var(--primary-500-op30)' },
          '50%': { boxShadow: '0 0 40px var(--primary-500-op60)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}