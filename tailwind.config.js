const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./index.html"],
    theme: {
      colors:{
        transparent: 'transparent',
        sky: colors.sky,
        black: colors.black,
        orange: colors.orange,
        white: colors.white,
        green: colors.green,
      },
      extend: {},
    },
    plugins: [],
  }