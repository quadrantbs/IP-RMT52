/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    colors: {
      primary: {
        DEFAULT: "#FAF6F0",
      },
      secondary: {
        DEFAULT: "#F4EAE0",
      },
      accent: {
        DEFAULT: "#F4DFC8",
      },
      neutral: {
        DEFAULT: "#000000",
      },
    },
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  plugins: [],
};
