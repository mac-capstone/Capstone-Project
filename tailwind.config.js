const colors = require('./src/components/ui/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter'],
        futura: ['FuturaCyrillic'],
        futuraBold: ['FuturaCyrillicBold'],
        futuraBook: ['FuturaCyrillicBook'],
        futuraDemi: ['FuturaCyrillicDemi'],
        futuraExtraBold: ['FuturaCyrillicExtraBold'],
        futuraHeavy: ['FuturaCyrillicHeavy'],
        futuraLight: ['FuturaCyrillicLight'],
        futuraMedium: ['FuturaCyrillicMedium'],
      },
      colors,
    },
  },
  plugins: [],
};
