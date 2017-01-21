const { test } = require('ava')
const { resolve } = require('path')
const requireUncached = require('require-uncached')
const isMatch = require('lodash.ismatch')

const subjectPath = '.'
const defaultGetConfig = () => ({
  CLIEngineOptions: {
    rules: {
      quotes: ['error', 'single']
    }
  }
})

test.before(async () => {
  process.chdir(resolve(__dirname, 'lint-files.fixture'))
})

test.beforeEach((t) => {
  const Subject = requireUncached(subjectPath)
  t.context.instance = new Subject(defaultGetConfig)
})

test('lints some files', async (t) => {
  const report = await t.context.instance.lintFiles(['**/*.js'])
  const match = {
    results: [
      {
        messages: [
          {
            ruleId: 'quotes',
            severity: 2,
            line: 1,
            column: 1,
            source: '"Let go, Jean"'
          }
        ]
      }
    ]
  }
  t.true(isMatch(report, match))
})
