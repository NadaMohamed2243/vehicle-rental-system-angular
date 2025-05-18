/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "dark-2": "#1F1F1F",
        "dark-4": "#2D2D2D",
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  corePlugins: {
    inset: true, // Enables positioning utilities like 'left-0'
  },
  plugins: [],
};
