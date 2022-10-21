/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          "50": "#3b5a84",
          "100": "#31507a",
          "200": "#274670",
          "300": "#1d3c66",
          "400": "#13325c",
          "500": "#092852",
          "600": "#001e48",
          "700": "#00143e",
          "800": "#000a34",
          "900": "#00002a"
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
