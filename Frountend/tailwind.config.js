/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'custom': '450px', // Custom breakpoint for 850px and up
      },
      keyframes: {
        'lightning-glow': {
          '0%, 100%': { filter: 'brightness(1.1) drop-shadow(0 0 8px #a78bfa)' },
          '50%': { filter: 'brightness(1.4) drop-shadow(0 0 24px #f472b6)' },
        },
      },
      animation: {
        'lightning-glow': 'lightning-glow 2.2s infinite cubic-bezier(0.4,0,0.2,1)',
      },
    },
  },
  plugins: [],
}
