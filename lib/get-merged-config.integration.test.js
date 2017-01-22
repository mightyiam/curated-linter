const { test } = require('ava')
const { resolve } = require('path')

const subjectPath = '.'
const Subject = require(subjectPath)

const defaultGetConfig = () => ({
  name: 'foolint',
  curated: true,
  array: ['curated', 'curated']
})

test.before(async () => {
  process.chdir(resolve(__dirname, 'fixture'))
})

test('when not `packageJson` does not merge from `package.json`', async (t) => {
  const subject = new Subject(defaultGetConfig)
  const actual = await subject.getMergedConfig()
  const expected = defaultGetConfig()
  t.deepEqual(actual, expected)
})

test('when `packageJson: true` merges from `package.json`', async (t) => {
  const getConfig = () => Object.assign(defaultGetConfig(), { packageJson: true })
  const subject = new Subject(getConfig)
  const actual = await subject.getMergedConfig()
  const expected = {
    name: 'foolint',
    curated: true,
    user: true,
    'null': null,
    packageJson: true,
    array: ['user', 'curated']
  }
  t.deepEqual(actual, expected)
})
