/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  safelist: [
  'inline-block', 'relative', 'my-8', 'text-3xl', 'md:text-5xl', 'tracking-widest', 'text-white', 'font-sans', 'whitespace-normal', 'md:whitespace-nowrap', 'leading-relaxed'
],
  theme: {
    extend: {},
  },
  plugins: [],
}