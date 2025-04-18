// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#ffffff",
      },
      fontFamily: {
        nunito: ['"Nunito"', "sans-serif"],
        lexend: ['"Lexend"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
