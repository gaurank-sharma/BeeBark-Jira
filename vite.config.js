import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FFD700', // The specific "Bee" yellow
          black: '#1A1A1A',  // A softer, professional black
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Recommended clean font
      }
    },
  },
  plugins: [],
}