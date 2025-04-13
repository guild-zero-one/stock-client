const { roRO } = require('@mui/material/locale');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}", 
    ],
    theme: {
      extend: {
        fontFamily: {
          lexend: ['--font-lexend', 'sans-serif'],
          nunito: ['--font-nunito', 'sans-serif'],
          roboto: ['--font-roboto', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }
  