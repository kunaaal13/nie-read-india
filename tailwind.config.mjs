/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        epilogue: ["Epilogue", "sans-serif"],
        dina: ["DinaChaumont", "sans-serif"],
        "dina-text": ["DinaChaumont Text", "sans-serif"],
        dreaming: ["Dreaming Outloud", "cursive"],
      },
    },
  },
  plugins: [],
};
