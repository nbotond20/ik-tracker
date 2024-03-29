/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve('prettier-plugin-tailwindcss'), require.resolve('@trivago/prettier-plugin-sort-imports')],
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
  tailwindConfig: './tailwind.shared.config.cjs',
}
