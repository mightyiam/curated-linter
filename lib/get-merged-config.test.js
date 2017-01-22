const { test } = require('ava')
const requireUncached = require('require-uncached')
const mockPathWithSpy = require('mock-path-with-simple-spy')
const isPlainObj = require('is-plain-obj')

const subjectPath = './get-merged-config'
const getPkgConfMocks = mockPathWithSpy('pkg-conf', Promise.resolve(Symbol('getPkgConfMocksResolved')))
const mergeMocks = mockPathWithSpy('lodash.merge')

test.beforeEach((t) => {
  t.context.getPkgConfMock = getPkgConfMocks.next().value
  t.context.mergeMock = mergeMocks.next().value
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

test('async calls `merge` once', async (t) => {
  await t.context.subject.apply(...defaultApplyArgs)
  t.is(t.context.mergeMock.args.length, 1)
})

test('`merge` call has three args', async (t) => {
  await t.context.subject.apply(...defaultApplyArgs)
  t.is(t.context.mergeMock.args[0].length, 3)
})

test('`merge` first call arg is `this.config`', async (t) => {
  await t.context.subject.apply(...defaultApplyArgs)
  t.is(t.context.mergeMock.args[0][0], defaultInstance.config)
})

test('if `this.config.packageJson`, `merge` second call arg is what `getPkgConf` resolves to', async (t) => {
  await t.context.subject.apply({ config: { packageJson: true } })
  t.is(t.context.mergeMock.args[0][1], await getPkgConfMocks.spyReturn)
})

test('if not `this.config.packageJson`, `merge` second call arg is plain empty object', async (t) => {
  await t.context.subject.apply(...defaultApplyArgs)
  t.deepEqual(t.context.mergeMock.args[0][1], {})
  t.true(isPlainObj(t.context.mergeMock.args[0][1]))
})

test('if provided, `merge` third call arg is provided `config`', async (t) => {
  await t.context.subject.apply(...defaultApplyArgs)
  t.is(t.context.mergeMock.args[0][2], defaultConfig)
})

test('if `config` not provided, `merge` third call arg is empty plain object', async (t) => {
  await t.context.subject.apply(defaultInstance)
  t.true(isPlainObj(t.context.mergeMock.args[0][1]))
  t.deepEqual(t.context.mergeMock.args[0][2], {})
})

test('returns a promise', (t) => {
  const retVal = t.context.subject.apply(...defaultApplyArgs)
  t.true(retVal instanceof Promise)
})

test('returned promise resolves to what `merge` returns', async (t) => {
  const resolved = await t.context.subject.apply(...defaultApplyArgs)
  t.is(resolved, mergeMocks.spyReturn)
})
