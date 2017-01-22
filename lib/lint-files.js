const clone = require('clone')
const lintFilesPkg = require('lint-files')
const deglob = require('./deglob')
const configToDeglobOpts = require('./config-to-deglob-opts')

const lintFiles = function (files, config = {}) {
  return this
    .getMergedConfig(config)
    .then((mergedConfig) => {
      return Promise.all([
        mergedConfig,
        deglob(
          files || mergedConfig.defaultFiles,
          configToDeglobOpts(mergedConfig)
        )
      ])
    })
    .then(([mergedConfig, allFiles]) => {
      return lintFilesPkg(clone(mergedConfig.CLIEngineOptions), allFiles)
    })
}

module.exports = lintFiles
