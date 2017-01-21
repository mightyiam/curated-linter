const { test } = require('ava')
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

test.beforeEach((t) => {
  const Subject = requireUncached(subjectPath)
  t.context.instance = new Subject(defaultGetConfig)
})

test('lints some text', async (t) => {
  const report = await t.context.instance.lintText(['"Unleash your power, Jean"'])
  const match = {
    results: [
      {
        messages: [
          {
            ruleId: 'quotes',
            severity: 2,
            line: 1,
            column: 1,
            source: '"Unleash your power, Jean"'
          }
        ]
      }
    ]
  }
  t.true(isMatch(report, match))
})
