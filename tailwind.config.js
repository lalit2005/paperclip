const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './tailwind-ignore.txt',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.blueGray,
      },
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['Menlo', 'monospace'],
    },
  },
  variants: {
    extend: {
      backdropBlur: ['hover', 'focus'],
      blur: ['hover', 'focus'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
