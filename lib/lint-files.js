const lintFilesPkg = require('lint-files')

const lintFiles = function (files, config = {}) {
  return this
    .getMergedConfig(config)
    .then(mergedConfig => lintFilesPkg(mergedConfig.CLIEngineOptions, files))
}

module.exports = lintFiles
