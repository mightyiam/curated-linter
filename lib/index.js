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
  getMergedOpts: require('./get-merged-opts')
})

module.exports = CuratedLinter
