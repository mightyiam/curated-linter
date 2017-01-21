const { test } = require('ava')
const requireUncached = require('require-uncached')
const mockPathWithSpy = require('mock-path-with-simple-spy')
const { spy } = require('simple-spy')
const isPlainObj = require('is-plain-obj')

const subjectPath = './lint-files'
const lintFilesPkgMocks = mockPathWithSpy('lint-files')
const cloneMocks = mockPathWithSpy('clone')
const getMergedConfigRetVal = Promise.resolve({ CLIEngineOptions: {} })
const defaultFiles = Symbol('defaultFiles')
const defaultConfig = Symbol('defaultConfig')
const defaultArgs = [defaultFiles, defaultConfig]

test.beforeEach((t) => {
  t.context.instance = { getMergedConfig: spy(() => getMergedConfigRetVal) }
  t.context.lintFilesPkgMock = lintFilesPkgMocks.next().value
  t.context.cloneMock = cloneMocks.next().value
  t.context.subject = requireUncached(subjectPath)
})

test('exports a function', (t) => {
  t.is(typeof t.context.subject, 'function')
})

test('calls `this.getMergedConfig` once', (t) => {
  t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(t.context.instance.getMergedConfig.args.length, 1)
})

test('`this.getMergedConfig` call has 1 argument', (t) => {
  t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(t.context.instance.getMergedConfig.args[0].length, 1)
})

test('if provided, `this.getMergedConfig` first call arg is provided `config`', (t) => {
  t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(t.context.instance.getMergedConfig.args[0][0], defaultConfig)
})

test('if not provided, `this.getMergedConfig` first call arg is plain empty object', (t) => {
  t.context.subject.apply(t.context.instance, [defaultFiles])
  t.true(isPlainObj(t.context.instance.getMergedConfig.args[0][0]))
  t.deepEqual(t.context.instance.getMergedConfig.args[0][0], {})
})

test('`clone` is async called once', async (t) => {
  await t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(t.context.cloneMock.args.length, 1)
})

test('`clone` call has one argument', async (t) => {
  await t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(t.context.cloneMock.args[0].length, 1)
})

test('`clone` call first arg is `CLIEngineOptions` prop of what `this.getMergedConfig` resolves to', async (t) => {
  await t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(t.context.cloneMock.args[0][0], (await getMergedConfigRetVal).CLIEngineOptions)
})

test('`lintFilesPkg` is async called once', async (t) => {
  await t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(t.context.lintFilesPkgMock.args.length, 1)
})

test('`lintFilesPkg` call has two arguments', async (t) => {
  await t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(t.context.lintFilesPkgMock.args[0].length, 2)
})

test('`lintFilesPkg` call first arg is what `clone` returns', async (t) => {
  await t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(t.context.lintFilesPkgMock.args[0][0], cloneMocks.spyReturn)
})

test('`lintFilesPkg` call second arg is provided `files`', async (t) => {
  await t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(t.context.lintFilesPkgMock.args[0][1], defaultFiles)
})

test('returns a promise', (t) => {
  const retVal = t.context.subject.apply(t.context.instance, defaultArgs)
  t.true(retVal instanceof Promise)
})

test('resolves to what `lintFilesPkg` returns', async (t) => {
  const actual = await t.context.subject.apply(t.context.instance, defaultArgs)
  t.is(actual, lintFilesPkgMocks.spyReturn)
})
