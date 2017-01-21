const lintTextPkg = require('lint-text')

const lintText = function (texts, config = {}) {
  return this
    .getMergedOpts(config)
    .then(mergedOpts => lintTextPkg(mergedOpts.CLIEngineOptions, texts))
}

module.exports = lintText
