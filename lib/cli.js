const meow = require('meow')
const setExitCode = require('./set-exit-code')

const cli = function () {
  const {
    input
  } = meow({}, {})

  const files = input.length ? input : null
  this.getMergedConfig()
    .then((mergedConfig) => {
      return Promise.all([
        this.lintFiles(files),
        mergedConfig
      ])
    })
    .then(([
      report,
      mergedConfig
    ]) => {
      if (!report.errorCount) return
      console.error(mergedConfig.formatter(report.results))
      setExitCode(1)
    })
}

module.exports = cli
