const getPkgConf = require('pkg-conf')
const deepAssign = require('deep-assign')

const getMergedOpts = function (options = {}) {
  const pkgOpts = this.options.packageJson ? getPkgConf(this.options.name) : Promise.resolve({})
  return pkgOpts.then(pkgOpts => deepAssign(this.options, pkgOpts, options))
}

module.exports = getMergedOpts
