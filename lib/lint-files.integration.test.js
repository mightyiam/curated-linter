const { test } = require('ava')
const { resolve } = require('path')
const requireUncached = require('require-uncached')
const isMatch = require('lodash.ismatch')

const subjectPath = '.'
const defaultGetConfig = () => ({
  CLIEngineOptions: {
    baseConfig: {
      extends: 'standard'
    }
  }
})

test.before(async () => {
  process.chdir(resolve(__dirname, 'fixture'))
})

test.beforeEach((t) => {
  const Subject = requireUncached(subjectPath)
  t.context.instance = new Subject(defaultGetConfig)
})

test('lints some files', async (t) => {
  const report = await t.context.instance.lintFiles(['quotes.js'])
  const match = {
    results: [
      {
        messages: [
          {
            ruleId: 'quotes',
            severity: 2,
            line: 1,
            column: 1
          }
        ],
        source: '"Unleash your power, Jean"\n'
      }
    ]
  }
  t.true(isMatch(report, match))
})
