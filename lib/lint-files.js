const lintFilesPkg = require('lint-files')

const lintFiles = function (files, options = {}) {
  return this
    .getMergedOpts(options)
    .then(mergedOpts => lintFilesPkg(mergedOpts.CLIEngineOptions, files))
}

module.exports = lintFiles
