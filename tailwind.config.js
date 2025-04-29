/** @type {import('tailwindcss').Config} */
import { colors } from "./src/shared/constants/colors";

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: colors,
    },
  },
  plugins: [require("daisyui")], // Adicione o DaisyUI aqui
};
