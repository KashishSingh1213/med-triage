/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'esi-1': '#dc2626',
        'esi-2': '#ea580c',
        'esi-3': '#f59e0b',
        'esi-4': '#eab308',
        'esi-5': '#22c55e',
      },
    },
  },
  plugins: [],
}
