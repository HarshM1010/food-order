/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out',
        'slideInRight': 'slideInRight 0.3s ease-out',
        'scaleIn': 'scaleIn 0.3s ease-out',
      }
    },
  },
  plugins: [],
}