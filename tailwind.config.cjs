const config = require('./tailwind.shared.config.cjs')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...config,
  plugins: [require('@tailwindcss/line-clamp'), require('flowbite/plugin')],
}
