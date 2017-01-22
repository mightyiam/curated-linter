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

const fixtureDir = resolve(__dirname, 'fixture')

test.before(async () => {
  process.chdir(fixtureDir)
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

test('lints `defaultFiles`', async (t) => {
  const report = await t.context.instance.lintFiles(null, { defaultFiles: ['quotes.js'] })
  const match = {
    results: [
      {
        messages: [
          {
            ruleId: 'quotes'
          }
        ]
      }
    ]
  }
  t.true(isMatch(report, match))
})

test('use `gitIgnore`', async (t) => {
  const report = await t.context.instance.lintFiles(['quotes.js', 'semi.js'], { gitIgnore: true })
  const match = {
    results: [
      {
        messages: [
          {
            ruleId: 'quotes'
          }
        ]
      }
    ]
  }
  t.true(isMatch(report, match))
  t.is(report.results.length, 1)
})

test('use `ignore`', async (t) => {
  const report = await t.context.instance.lintFiles(['quotes.js', 'semi.js'], { ignore: ['semi.js'] })
  const match = {
    results: [
      {
        messages: [
          {
            ruleId: 'quotes'
          }
        ]
      }
    ]
  }
  t.true(isMatch(report, match))
  t.is(report.results.length, 1)
})

test('use `cwd`', async (t) => {
  const report = await t.context.instance.lintFiles(['no-unused-vars.js'], { cwd: resolve(fixtureDir, 'subdir') })
  const match = {
    results: [
      {
        messages: [
          {
            ruleId: 'no-unused-vars'
          }
        ]
      }
    ]
  }
  t.true(isMatch(report, match))
  t.is(report.results.length, 1)
})
