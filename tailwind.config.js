/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00A67E',
          dark: '#008F6C',
          light: '#33C19E',
        },
        secondary: {
          DEFAULT: '#143F6B',
          dark: '#0F2D4D',
          light: '#1E5791',
        },
        accent: {
          DEFAULT: '#FFC727',
          dark: '#F5B800',
          light: '#FFD155',
        },
        danger: {
          DEFAULT: '#FF1E1E',
          dark: '#E60000',
          light: '#FF5050',
        },
        success: {
          DEFAULT: '#00A67E',
          dark: '#008F6C',
          light: '#33C19E',
        },
        warning: {
          DEFAULT: '#FFC727',
          dark: '#F5B800',
          light: '#FFD155',
        },
        background: {
          dark: '#1A1A1A',
          DEFAULT: '#F5F7FA',
          card: '#FFFFFF',
        },
        text: {
          DEFAULT: '#1A1A1A',
          secondary: '#6C7293',
          light: '#FFFFFF',
        },
        home: {
          start: '#0d0d2b',
          end: '#5c1286',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};