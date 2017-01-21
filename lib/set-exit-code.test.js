const { test } = require('ava')

const subject = require('./set-exit-code')

test('exports function', (t) => {
  t.is(typeof subject, 'function')
})

test.serial('sets `process.exitCode` to provided first arg', (t) => {
  const original = process.exitCode
  const value = 1242345123452123124245230581
  subject(value)
  t.is(process.exitCode, value)
  process.exitCode = original
})
