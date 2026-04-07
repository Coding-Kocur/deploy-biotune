/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        'biotune-black': '#0a0a0a',
        'biotune-dark': '#1a1a1a',
        'biotune-red': '#ff0000',
        'biotune-text': '#cccccc',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
