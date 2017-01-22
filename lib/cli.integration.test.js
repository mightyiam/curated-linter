const { test } = require('ava')
const { resolve } = require('path')
const dargs = require('dargs')
const pify = require('pify')
const { execFile } = pify(
  require('child_process'),
  { multiArgs: true, include: ['execFile'] }
)
const flatMap = require('lodash.flatmap')

const resultsToRuleIds = (results) => {
  return flatMap(results, (result) => {
    return result.messages.map((message) => {
      return message.ruleId
    })
  })
}

const execLinter = (args) => {
  const fixtureDir = resolve(__dirname, 'fixture')
  return execFile(
    resolve(fixtureDir, 'linter'),
    dargs(args),
    { cwd: fixtureDir }
  ).catch(results => results)
}

test('fail', async (t) => {
  const [ err ] = await execLinter({
    _: ['quotes.js']
  })
  t.is(err.code, 1)
})

test('pass', async (t) => {
  const [ stdout, stderr ] = await execLinter({
    _: ['compliant.js']
  })
  t.is(stdout, '')
  t.is(stderr, '')
})

test('lint files provided in arguments', async (t) => {
  let stderr, failedRuleIds
  [,, stderr] = await execLinter({
    _: ['quotes.js']
  })
  failedRuleIds = resultsToRuleIds(JSON.parse(stderr))
  t.deepEqual(failedRuleIds, ['quotes'])
  ;[,, stderr] = await execLinter({
    _: ['semi.js']
  })
  failedRuleIds = resultsToRuleIds(JSON.parse(stderr))
  t.deepEqual(failedRuleIds, ['semi'])
  ;[,, stderr] = await execLinter({
    _: ['quotes.js', 'semi.js']
  })
  failedRuleIds = resultsToRuleIds(JSON.parse(stderr))
  t.deepEqual(failedRuleIds, ['quotes', 'semi'])
  ;[, stderr] = await execLinter({
    _: ['compliant.js']
  })
  t.is(stderr, '')
})
