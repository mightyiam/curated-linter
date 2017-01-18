const CuratedLinter = class {
  constructor (name, getOptions = () => ({})) {
    Object.assign(this, { name, getOptions })
  }
  get options () {
    return this.getOptions()
  }
}

Object.assign(CuratedLinter.prototype, {
  lintText: require('./lint-text'),
  lintFiles: require('./lint-files'),
  getMergedOpts: require('./get-merged-opts')
})

module.exports = CuratedLinter
