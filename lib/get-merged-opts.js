const getPkgConf = require('pkg-conf')
const deepAssign = require('deep-assign')

const getMergedOpts = function (config = {}) {
  const pkgOpts = this.config.packageJson ? getPkgConf(this.config.name) : Promise.resolve({})
  return pkgOpts.then(pkgOpts => deepAssign(this.config, pkgOpts, config))
}

module.exports = getMergedOpts
