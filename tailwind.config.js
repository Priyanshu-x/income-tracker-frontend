/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1D4ED8',
        'chart-1': '#8884d8',
        'chart-2': '#82ca9d',
        'chart-3': '#ffc658',
        'chart-4': '#ff7300',
        'dark-chart-1': '#6a5acd', /* Darker shade for chart-1 */
        'dark-chart-2': '#66b2b2', /* Darker shade for chart-2 */
        'dark-chart-3': '#cc9933', /* Darker shade for chart-3 */
        'dark-chart-4': '#b35900', /* Darker shade for chart-4 */
      },
    },
  },
  plugins: [],
}