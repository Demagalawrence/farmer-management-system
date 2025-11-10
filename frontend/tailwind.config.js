/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Financial Manager Portal Brand Colors
        'fm-primary': '#0369A1',      // Primary brand color (Sky-700)
        'fm-primary-light': '#7DD3FC', // Light variant (Sky-300)
        'fm-primary-dark': '#0C4A6E',  // Dark variant (Sky-900)
        'fm-primary-hover': '#075985', // Hover state (Sky-800)
        'fm-secondary': '#F0F9FF',     // Very light background (Sky-50)
        'fm-accent': '#0284C7',        // Accent color (Sky-600)
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
