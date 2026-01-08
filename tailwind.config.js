/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Mostra Nuova', 'sans-serif'],
        body: ['Poiret One', 'sans-serif'],
      },
    },
  },
  plugins: [],
}