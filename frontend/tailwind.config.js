/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#152032',
      },
      backdropBlur: {
        'xl': '12px',
      },
    },
  },
  plugins: [],
}
