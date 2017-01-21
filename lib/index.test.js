const { test } = require('ava')
const requireUncached = require('require-uncached')
const isPlainObj = require('is-plain-obj')

test.beforeEach((t) => {
  t.context.Subject = requireUncached('.')
  t.context.subject = new t.context.Subject()
})

test('exports a function', (t) => {
  t.is(typeof t.context.Subject, 'function')
})

test('is a class', (t) => {
  const instance = new t.context.Subject()
  t.true(instance instanceof t.context.Subject)
})

const hasMethod = (t, name) => {
  t.is(typeof t.context.subject[name], 'function')
}
hasMethod.title = (_, name) => `has method \`${name}\``

test(hasMethod, 'lintText')
test(hasMethod, 'lintFiles')
test(hasMethod, 'getMergedOpts')

test('if `getConfig` not provided, `config` is plain object', (t) => {
  const subject = new t.context.Subject()
  t.true(isPlainObj(subject.config))
})

test('if `getConfig` not provided, `config` is empty object', (t) => {
  const subject = new t.context.Subject()
  t.deepEqual(subject.config, {})
})

test('if `getConfig` not provided, `config` unique with every `get`', (t) => {
  const subject = new t.context.Subject()
  t.not(subject.config, subject.config)
})

test('if provided, `getConfig` used as getter for `config`', (t) => {
  const config = {}
  const getConfig = () => config
  const subject = new t.context.Subject(getConfig)
  t.is(subject.config, config)
})

test('result of `getConfig` is not cached', (t) => {
  const getConfig = () => ({})
  const subject = new t.context.Subject(getConfig)
  t.not(subject.config, subject.config)
})
