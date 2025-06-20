/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app.jsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#0D308C',
        secondary: '#F472B6'
      }
    },
  },
  plugins: [],
}