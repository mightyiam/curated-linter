const clone = require('clone')
const lintFilesPkg = require('lint-files')

const lintFiles = function (files, config = {}) {
  return this
    .getMergedConfig(config)
    .then(mergedConfig => lintFilesPkg(clone(mergedConfig.CLIEngineOptions), files))
}

module.exports = lintFiles
