const lintFilesPkg = require('lint-files')

const lintFiles = function (files, config = {}) {
  return this
    .getMergedOpts(config)
    .then(mergedOpts => lintFilesPkg(mergedOpts.CLIEngineOptions, files))
}

module.exports = lintFiles
