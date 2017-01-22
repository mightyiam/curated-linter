const { test } = require('ava')

const subject = require('./config-to-deglob-opts')

test('exports a function', (t) => {
  t.is(typeof subject, 'function')
})

const propDerivedFrom = (t, outputProp, inputProp) => {
  const value = Symbol('value')
  t.is(subject({ [inputProp]: value })[outputProp], value)
}

propDerivedFrom.title = (_, outputProp, inputProp) => `\`${outputProp}\` is derived from \`${inputProp}\``

const propAlways = (t, prop, value) => {
  t.is(subject({})[prop], value)
  t.is(subject({ [prop]: Symbol('not this') })[prop], value)
}
propAlways.title = (_, prop, value) => `\`${prop}\` is always \`${value}\``

const propDefault = (t, prop, value) => {
  t.is(subject({})[prop], value)
}
propDefault.title = (_, prop, value) => `\`${prop}\` is \`${value}\` by default`

test(propAlways, 'usePackageJson', false)
test(propDerivedFrom, 'useGitIgnore', 'gitIgnore')
test(propDerivedFrom, 'ignore', 'ignore')
test(propDerivedFrom, 'cwd', 'cwd')
test(propDerivedFrom, 'useGitIgnore', 'gitIgnore')
test(propDefault, 'useGitIgnore', false)
