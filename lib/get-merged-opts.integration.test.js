const { test } = require('ava')
const { resolve } = require('path')

const subjectPath = '.'
const Subject = require(subjectPath)

const defaultName = 'foolint'
const defaultGetOptions = () => ({
  curated: true,
  array: ['curated', 'curated']
})
const defaultArgs = [defaultName, defaultGetOptions]

test.before(async () => {
  process.chdir(resolve(__dirname, 'get-merged-opts.fixture'))
})

test('when not `packageJson` does not merge from `package.json`', async (t) => {
  const subject = new Subject(...defaultArgs)
  const actual = await subject.getMergedOpts()
  const expected = defaultGetOptions()
  t.deepEqual(actual, expected)
})

test('when `packageJson: true` merges from `package.json`', async (t) => {
  const getOptions = () => Object.assign(defaultGetOptions(), { packageJson: true })
  const subject = new Subject(defaultName, getOptions)
  const actual = await subject.getMergedOpts()
  const expected = {
    curated: true,
    user: true,
    packageJson: true,
    array: ['user', 'curated']
  }
  t.deepEqual(actual, expected)
})
