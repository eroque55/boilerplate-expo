module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  endOfLine: 'lf',
  plugins: [
    require.resolve('prettier-plugin-tailwindcss'),
    require.resolve('prettier-plugin-classnames'),
    require.resolve('prettier-plugin-merge'),
  ],
  tailwindAttributes: ['className'],
  classnamesPrintWidth: 120,
};
