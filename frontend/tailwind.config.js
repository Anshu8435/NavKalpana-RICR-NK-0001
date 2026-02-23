
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a3d62',
        primaryDark: '#3c6382',
        accent: '#ff6b4a',
        accentHover: '#e65a39',
      },
    },
  },
  plugins: [],
}