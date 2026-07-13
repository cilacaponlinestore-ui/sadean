/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eefbf5', 100: '#d7f5e7', 200: '#b2ead1', 300: '#80d9b5',
          400: '#49c29a', 500: '#25a880', 600: '#178669', 700: '#146b57',
          800: '#135546', 900: '#11463b',
        },
        clay: { 50: '#fff7ed', 100: '#ffedd5', 500: '#c9683a', 600: '#a84f29' },
        ink: '#17221d',
        canvas: '#f8f6f1',
      },
      boxShadow: { soft: '0 18px 50px -30px rgba(23, 34, 29, .35)' },
    },
  },
  plugins: [],
};
