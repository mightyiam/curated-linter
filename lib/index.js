const CuratedLinter = class {
  constructor (getConfig = () => ({})) {
    Object.assign(this, { getConfig })
  }
  get config () {
    return this.getConfig()
  }
}

Object.assign(CuratedLinter.prototype, {
  lintText: require('./lint-text'),
  lintFiles: require('./lint-files'),
  getMergedConfig: require('./get-merged-config')
})

module.exports = CuratedLinter
