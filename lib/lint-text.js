const lintTextPkg = require('lint-text')

const lintText = function (texts, options = {}) {
  return this
    .getMergedOpts(options)
    .then(mergedOpts => lintTextPkg(mergedOpts.CLIEngineOptions, texts))
}

module.exports = lintText
