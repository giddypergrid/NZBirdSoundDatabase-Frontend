/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f5f0',
          100: '#d8e8d8',
          200: '#a8cca8',
          300: '#6ba36b',
          400: '#3d7a3d',
          500: '#2d5a2d',
          600: '#1e3f2a',
          700: '#1a3424',
          800: '#152a1e',
          900: '#0f2018',
          950: '#0a1610',
        },
        // light redesign tokens
        paper: '#f4f7f4',
        card: '#ffffff',
        'card-2': '#eef2ee',
        ink: '#13241d',
        subtle: '#566b60',
        faint: '#869488',
        hair: '#e0e7e1',
        'hair-strong': '#cfd8d0',
        brand: { DEFAULT: '#0e4d3b', 600: '#14624b', 700: '#0a3a2c', tint: '#e7efe9' },
        gold: { DEFAULT: '#b57e18', tint: '#f3ead6' },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
    },
  },
  plugins: [],
}