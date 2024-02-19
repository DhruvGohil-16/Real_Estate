/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    screens: {'ty': '0px', 'df':'320px', 'ds': '500px', 'sm': '640px', 'smd0': '690px','smd': '719px','md': '846px', 'mdl':'913px','lg': '1024px', 'xl': '1280px', '2xl': '1536px'},
    extend: {},
  },
  plugins: [],
}