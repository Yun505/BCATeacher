const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./index.html"],
    theme: {
      container:{center:true
      },
      listStyleType:{
        none: 'none',
        disc: 'disc',
        decimal: 'decimal',
      },
      colors:{
        transparent: 'transparent',
        sky: colors.sky,
        black: colors.black,
        orange: colors.orange,
        white: colors.white,
        green: colors.green,
        blue: colors.blue,
        indigo: colors.indigo,
        purple: colors.purple,
        rose: colors.rose,
        black: colors.black,
      },
      extend: {},
    },
    plugins: [],
  }