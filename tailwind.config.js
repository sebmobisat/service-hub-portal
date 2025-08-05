/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{html,js}",
    "./js/**/*.js",
    "./index.html",
    "./header.html",
    "./footer.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00D4FF',
        secondary: '#0099CC',
        accent: '#00B8E6',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
  darkMode: 'class'
} 