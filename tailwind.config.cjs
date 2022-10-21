/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Modeseven", "monospace"],
    },
    extend: {
      colors: {
        cantoGreen: "#06fc99",
        cantoGreenDark: "#11d888",
        cantoGreenDarker: "#05955b",
        cantoError: "#e74c3c",
        offWhite: "#f2f2f2",
        semiGrey: "#b3b3b3",
        holyGrey: "#8b8b8b",
        justGrey: "#717171",
        darkGrey: "#424242",
        tooDark: "#222222",
        pitchBlack: "#111111",
      },
    },
  },
  plugins: [],
};
