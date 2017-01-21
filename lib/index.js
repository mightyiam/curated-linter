const { sep } = require('path')

const CuratedLinter = class {
  constructor (getConfig = () => ({})) {
    Object.assign(this, { getConfig })

    const isCli = process.argv[1].endsWith(sep + this.config.name)
    isCli && this.cli()
  }
  get config () {
    return this.getConfig()
  }
}

Object.assign(CuratedLinter.prototype, {
  lintText: require('./lint-text'),
  lintFiles: require('./lint-files'),
  getMergedConfig: require('./get-merged-config'),
  cli: require('./cli')
})

module.exports = CuratedLinter
