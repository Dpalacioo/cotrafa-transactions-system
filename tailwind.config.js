/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class", // activa dark mode mediante clase 'dark'
  theme: {
    extend: {
      colors: {
        primary: "#1D4ED8", // azul principal
        secondary: "#2563EB", // azul secundario
        accent: "#F59E0B", // naranja
        bgLight: "#F3F4F6", // fondo light
        bgDark: "#1F2937", // fondo dark
        textLight: "#111827",
        textDark: "#F9FAFB",
      },
    },
  },
  plugins: [],
};
