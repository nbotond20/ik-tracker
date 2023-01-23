/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  arrowParens: 'avoid',
  bracketSameLine: false,
  endOfLine: 'auto',
  importOrder: ['^react(.*)', 'antd/(.*)', '<THIRD_PARTY_MODULES>', '@/(.*)', '^[./]'],
  importOrderSeparation: true,
  jsxSingleQuote: false,
  printWidth: 120,
  quoteProps: 'preserve',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
}
