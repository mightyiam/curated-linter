const { test } = require('ava')
const requireUncached = require('require-uncached')
const mockPathWithSpy = require('mock-path-with-simple-spy')
const isPlainObj = require('is-plain-obj')

const subjectPath = './get-merged-config'
const getPkgConfMocks = mockPathWithSpy('pkg-conf', Promise.resolve(Symbol('getPkgConfMocksResolved')))
const deepAssignMocks = mockPathWithSpy('deep-assign')

test.beforeEach((t) => {
  t.context.getPkgConfMock = getPkgConfMocks.next().value
  t.context.deepAssignMock = deepAssignMocks.next().value
  t.context.subject = requireUncached(subjectPath)
})

const defaultInstance = { config: {} }
const defaultConfig = {}

const defaultApplyArgs = [defaultInstance, [defaultConfig]]

test('exports a function', (t) => {
  t.is(typeof t.context.subject, 'function')
})

test('if `this.config.packageJson`, calls `getPkgConf` once', (t) => {
  const instance = { config: { packageJson: true } }
  t.context.subject.apply(instance, defaultConfig)
  t.is(t.context.getPkgConfMock.args.length, 1)
})

test('if not `this.config.packageJson`, does not call `getPkgConf`)', (t) => {
  t.context.subject.apply(...defaultApplyArgs)
  t.is(t.context.getPkgConfMock.args.length, 0)
})

test('async calls `deepAssign` once', async (t) => {
  await t.context.subject.apply(...defaultApplyArgs)
  t.is(t.context.deepAssignMock.args.length, 1)
})

test('`deepAssign` call has three args', async (t) => {
  await t.context.subject.apply(...defaultApplyArgs)
  t.is(t.context.deepAssignMock.args[0].length, 3)
})

test('`deepAssign` first call arg is `this.config`', async (t) => {
  await t.context.subject.apply(...defaultApplyArgs)
  t.is(t.context.deepAssignMock.args[0][0], defaultInstance.config)
})

test('if `this.config.packageJson`, `deepAssign` second call arg is what `getPkgConf` resolves to', async (t) => {
  await t.context.subject.apply({ config: { packageJson: true } })
  t.is(t.context.deepAssignMock.args[0][1], await getPkgConfMocks.spyReturn)
})

test('if not `this.config.packageJson`, `deepAssign` second call arg is plain empty object', async (t) => {
  await t.context.subject.apply(...defaultApplyArgs)
  t.deepEqual(t.context.deepAssignMock.args[0][1], {})
  t.true(isPlainObj(t.context.deepAssignMock.args[0][1]))
})

test('if provided, `deepAssign` third call arg is provided `config`', async (t) => {
  await t.context.subject.apply(...defaultApplyArgs)
  t.is(t.context.deepAssignMock.args[0][2], defaultConfig)
})

test('if `config` not provided, `deepAssign` third call arg is empty plain object', async (t) => {
  await t.context.subject.apply(defaultInstance)
  t.true(isPlainObj(t.context.deepAssignMock.args[0][1]))
  t.deepEqual(t.context.deepAssignMock.args[0][2], {})
})

test('returns a promise', (t) => {
  const retVal = t.context.subject.apply(...defaultApplyArgs)
  t.true(retVal instanceof Promise)
})

test('returned promise resolves to what `deepAssign` returns', async (t) => {
  const resolved = await t.context.subject.apply(...defaultApplyArgs)
  t.is(resolved, deepAssignMocks.spyReturn)
})