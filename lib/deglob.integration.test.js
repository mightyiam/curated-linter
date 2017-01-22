const { test } = require('ava')
const { sep, resolve } = require('path')

const subject = require('./deglob')

test('deglob a file', async (t) => {
  return subject(['*liant.js'], {
    cwd: resolve(__dirname, 'fixture')
  }).then((files) => {
    t.is(files.length, 1)
    t.true(files[0].endsWith(sep + 'compliant.js'))
  })
})
