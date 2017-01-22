const getPkgConfig = require('pkg-conf')
const deepAssign = require('deep-assign')

const getMergedConfig = function (config = {}) {
  const pkgConfig = this.config.packageJson ? getPkgConfig(this.config.name) : Promise.resolve({})
  return pkgConfig.then(pkgConfig => deepAssign(this.config, pkgConfig, config))
}

module.exports = getMergedConfig
