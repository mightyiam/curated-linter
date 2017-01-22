const getPkgConfig = require('pkg-conf')
const merge = require('lodash.merge')

const getMergedConfig = function (config = {}) {
  const pkgConfig = this.config.packageJson ? getPkgConfig(this.config.name) : Promise.resolve({})
  return pkgConfig.then(pkgConfig => merge(this.config, pkgConfig, config))
}

module.exports = getMergedConfig
