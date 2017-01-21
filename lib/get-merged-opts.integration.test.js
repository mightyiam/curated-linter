const { test } = require('ava')
const { resolve } = require('path')

const subjectPath = '.'
const Subject = require(subjectPath)

const defaultGetOptions = () => ({
  name: 'foolint',
  curated: true,
  array: ['curated', 'curated']
})

test.before(async () => {
  process.chdir(resolve(__dirname, 'get-merged-opts.fixture'))
})

test('when not `packageJson` does not merge from `package.json`', async (t) => {
  const subject = new Subject(defaultGetOptions)
  const actual = await subject.getMergedOpts()
  const expected = defaultGetOptions()
  t.deepEqual(actual, expected)
})

test('when `packageJson: true` merges from `package.json`', async (t) => {
  const getOptions = () => Object.assign(defaultGetOptions(), { packageJson: true })
  const subject = new Subject(getOptions)
  const actual = await subject.getMergedOpts()
  const expected = {
    name: 'foolint',
    curated: true,
    user: true,
    packageJson: true,
    array: ['user', 'curated']
  }
  t.deepEqual(actual, expected)
})
