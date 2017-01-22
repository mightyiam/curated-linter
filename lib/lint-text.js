const clone = require('clone')
const lintTextPkg = require('lint-text')

const lintText = function (text, config = {}) {
  return this
    .getMergedConfig(config)
    .then(mergedConfig => lintTextPkg(clone(mergedConfig.CLIEngineOptions), text))
}

module.exports = lintText
