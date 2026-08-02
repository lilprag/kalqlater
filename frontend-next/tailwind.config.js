/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#FDFBF7', surface: '#FFFFFF', ink: '#2D2825', subtle: '#5C554F',
          line: '#E8E2D9', saffron: '#E87A5D', teal: '#1F6C7D', plum: '#6E4555',
          sand: '#DAB49D', cream: '#F4F1EA',
        },
      },
      fontFamily: {
        display: ['Philosopher', 'Tiro Devanagari Hindi', 'Georgia', 'serif'],
        sans: ['Outfit', 'Hind', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
