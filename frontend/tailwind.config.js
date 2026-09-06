/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#10B981',
          emerald: '#0D5C46',      // اللون الأساسي المعتمد في التصميم
          emeraldDark: '#084031',  // لون الـ Hover
          accent: '#D97706',       // لون التنبيهات ونهاية الحملات (Amber)
          surface: '#F8FAFC',
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}