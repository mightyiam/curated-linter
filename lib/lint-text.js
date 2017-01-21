const clone = require('clone')
const lintTextPkg = require('lint-text')

const lintText = function (texts, config = {}) {
  return this
    .getMergedConfig(config)
    .then(mergedConfig => lintTextPkg(clone(mergedConfig.CLIEngineOptions), texts))
}

module.exports = lintText
