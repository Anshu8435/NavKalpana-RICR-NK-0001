/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Brand Palette
        midnight: {
          950: '#06121E',
          900: '#0B1F33', // Primary Midnight Navy
          800: '#123B5D', // Deep Medical Blue
          700: '#1B4D78',
          600: '#25639A',
        },
        teal: {
          brand: '#13B8A6',     // Medical Teal
          electric: '#20D9C2',  // Electric Teal
          soft: '#E8F8F4',      // Soft Mint
          dark: '#0F766E',
        },
        clinical: {
          bg: '#F5F8FC',        // Clinical Background
          card: '#FFFFFF',      // Pure White
          border: '#E0E8F0',    // Clean Borders
          primary: '#172B3A',   // Primary Text
          secondary: '#627487', // Secondary Text
          muted: '#8D9FB1',
        },
        // Clinical Risk Palette
        risk: {
          low: '#16866A',       // Low Risk Green
          lowBg: '#E8F8F4',
          moderate: '#D49A27',  // Moderate Risk Amber
          moderateBg: '#FEF6E7',
          high: '#D94F59',      // High Risk Crimson
          highBg: '#FDF2F3',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(11, 31, 51, 0.05), 0 2px 6px -1px rgba(11, 31, 51, 0.03)',
        'card-hover': '0 12px 30px -4px rgba(11, 31, 51, 0.1), 0 4px 12px -2px rgba(11, 31, 51, 0.05)',
        'teal-glow': '0 0 25px rgba(32, 217, 194, 0.35)',
        'navy-glow': '0 10px 30px -5px rgba(11, 31, 51, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'heartbeat': 'heartbeat 1.6s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.35s ease-out forwards',
        'slideUp': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        heartbeat: {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.08)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.06)' },
          '70%': { transform: 'scale(1)' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(6px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(14px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
