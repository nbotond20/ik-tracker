const { ESLint } = require('eslint')

module.exports = async files => {
  const eslint = new ESLint()
  const isIgnored = await Promise.all(
    files.map(file => {
      return eslint.isPathIgnored(file)
    })
  )

  const filteredFiles = files.filter((_, i) => !isIgnored[i]).map(path => `"${path}"`)
  return [`eslint ${filteredFiles.join(' ')} --max-warnings=0`]
}
