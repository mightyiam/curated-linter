const { test } = require('ava')
const requireUncached = require('require-uncached')
const isPlainObj = require('is-plain-obj')

const defaultName = 'foolint'
const defaultArgs = [defaultName]

test.beforeEach((t) => {
  t.context.Subject = requireUncached('.')
  t.context.subject = new t.context.Subject(...defaultArgs)
})

test('exports a function', (t) => {
  t.is(typeof t.context.Subject, 'function')
})

test('is a class', (t) => {
  const instance = new t.context.Subject(...defaultArgs)
  t.true(instance instanceof t.context.Subject)
})

const hasMethod = (t, name) => {
  t.is(typeof t.context.subject[name], 'function')
}
hasMethod.title = (_, name) => `has method \`${name}\``

test(hasMethod, 'lintText')
test(hasMethod, 'lintFiles')
test(hasMethod, 'getMergedOpts')

test('if `getOptions` not provided, `options` is plain object', (t) => {
  const subject = new t.context.Subject(defaultName)
  t.true(isPlainObj(subject.options))
})

test('if `getOptions` not provided, `options` is empty object', (t) => {
  const subject = new t.context.Subject(defaultName)
  t.deepEqual(subject.options, {})
})

test('if `getOptions` not provided, `options` unique with every `get`', (t) => {
  const subject = new t.context.Subject(defaultName)
  t.not(subject.options, subject.options)
})

test('if provided, `getOptions` used as getter for `options`', (t) => {
  const options = {}
  const getOptions = () => options
  const subject = new t.context.Subject(defaultName, getOptions)
  t.is(subject.options, options)
})

test('result of `getOptions` is not cached', (t) => {
  let options = { n: 1 }
  const getOptions = () => options.n++ && options
  const subject = new t.context.Subject(defaultName, getOptions)
  t.is(subject.options.n, 2)
  t.is(subject.options.n, 3)
})
