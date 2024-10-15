/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#AB222E",
        secondary: "#63A375",
        white: "#FFFFFF",
        secondaryWhite: "#F7F0F5",
        black: "#000000",
        gray: "#36453B",
      },
    },
  },
  plugins: [],
};
