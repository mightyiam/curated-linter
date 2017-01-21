const { test } = require('ava')
const requireUncached = require('require-uncached')
const mockPathWithSpy = require('mock-path-with-simple-spy')
const { spy } = require('simple-spy')
const isPlainObj = require('is-plain-obj')

const subjectPath = './lint-text'
const lintTextPkgMocks = mockPathWithSpy('lint-text')
const getMergedOptsRetVal = Promise.resolve({ CLIEngineOptions: {} })
const defaultTexts = Symbol('defaultTexts')
const defaultConfig = Symbol('defaultConfig')
const defaultArgs = [defaultTexts, defaultConfig]

test.beforeEach((t) => {
  t.context.instance = { getMergedOpts: spy(() => getMergedOptsRetVal) }
  t.context.lintTextPkgMock = lintTextPkgMocks.next().value
  t.context.subject = requireUncached(subjectPath)
})

test('exports a function', (t) => {
  t.is(typeof t.context.subject, 'function')
})

test('calls `this.getMergedOpts` once', (t) => {
  t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(t.context.instance.getMergedOpts.args.length, 1)
})

test('`this.getMergedOpts` call has 1 argument', (t) => {
  t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(t.context.instance.getMergedOpts.args[0].length, 1)
})

test('if provided, `this.getMergedOpts` first call arg is provided `config`', (t) => {
  t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(t.context.instance.getMergedOpts.args[0][0], defaultConfig)
})

test('if not provided, `this.getMergedOpts` first call arg is plain empty object', (t) => {
  t.context.subject.apply(t.context.instance, [defaultTexts])
  t.true(isPlainObj(t.context.instance.getMergedOpts.args[0][0]))
  t.deepEqual(t.context.instance.getMergedOpts.args[0][0], {})
})

test('`lintTextPkg` is async called once', async (t) => {
  await t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(t.context.lintTextPkgMock.args.length, 1)
})

test('`lintTextPkg` call has two arguments', async (t) => {
  await t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(t.context.lintTextPkgMock.args[0].length, 2)
})

test('`lintTextPkg` call first arg is `CLIEngineOptions` prop of what `this.getMergedOpts` resolves to', async (t) => {
  await t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(t.context.lintTextPkgMock.args[0][0], (await getMergedOptsRetVal).CLIEngineOptions)
})

test('`lintTextPkg` call second arg is provided `texts`', async (t) => {
  await t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(t.context.lintTextPkgMock.args[0][1], defaultTexts)
})

test('returns a promise', (t) => {
  const retVal = t.context.subject.apply(t.context.instance, defaultArgs)
  t.true(retVal instanceof Promise)
})

test('resolves to what `lintTextPkg` returns', async (t) => {
  const actual = await t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(actual, lintTextPkgMocks.spyReturn)
})
