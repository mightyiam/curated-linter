[![Build Status](https://travis-ci.org/mightyiam/curated-linter.svg?branch=master)](https://travis-ci.org/mightyiam/curated-linter)
[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# curated-linter

Makes curated ESLint linters, like [standard](http://standardjs.com/)

## What is a curated linter?

- a linter based on [ESLint’s `CLIEngine`](http://eslint.org/docs/developer-guide/nodejs-api#cliengine)
- has a name (e.g. "standard")
- has a curated ESLint configuration
- probably has a curated set of [ESLint rules](http://eslint.org/docs/rules/)
- may be [further configurable](#user-overrides) via `package.json`, to an exact, specified, extent
- may or may not allow [using an official, curated, set of extensions](#curated-extensions)
- may have either or both of an [API](#api) and a [CLI](#cli)
- [API](#api) may have either or both of `lintText` and `lintFiles`, which represent [`executeOnText`](http://eslint.org/docs/developer-guide/nodejs-api#executeontext) and [`executeOnFiles`](http://eslint.org/docs/developer-guide/nodejs-api#executeonfiles), respectively
- CLI may use a built-in [ESLint formatter](http://eslint.org/docs/user-guide/formatters/), or a [custom](http://eslint.org/docs/developer-guide/working-with-custom-formatters) one

## Example

`index.js`:
```js
const CuratedLinter = require('curated-linter')

const options = {
  gitIgnore: true
}

const cliEngineOptions = {
  ignore: false,
  useEslintrc: false,
  rules: {
    'id-blacklist': ['foo', 'bar']
    // ...
  }
}

const noFoobarLinter = CuratedLinter('nofoobar', options, cliEngineOptions)

module.exports = noFoobarLinter
```

`cli.js`:
```js
const { cli } = require('.')

const formatter = (result, options) => {
  // ...
}

cli(['**/*.js', '**/*.jsx'], formatter, process.argv.slice(2))
```

`package.json`:
```json
{
	"name": "foobar-linter",
	"main": "index.js",
	"bin": { "foobar-lint": "cli.js" }
}
```

## API

### `CuratedLinter(name, options, cliEngineOptions)`

Creates a curated linter

- `name`:
  machine name of the linter for use as key in users’ `package.json`
- `options`:
  - [`packageJson`](#user-packagejson-options)
  - `gitIgnore`:
    whether to ignore files that are ignored by a possibly existing `.gitignore`
  - [`curatedExtensions`](#curated-extensions)
- `cliEngineOptions`:
	will be passed to [`CLIEngine`](http://eslint.org/docs/developer-guide/nodejs-api#cliengine)

Returns a [`curatedLinter`](#curatedlinter)

### `curatedLinter`

The curated linter object. Its properties are described below:

#### `lintText(text, options, cliEngineOptions)`

Lints provided text

- `text`:
  text to lint
- [`options`](#user-overrides)
- [`cliEngineOptions`](#overriding-and-extending)

#### `lintFiles(files, options, cliEngineOptions)`

Lints files

- `files`:
  array of file glob patterns
- [`options`](#overriding-and-extending)
- [`cliEngineOptions`](#overriding-and-extending)

#### `cli(defaultFiles, formatter, argv)`

The CLI API

- `defaultFiles`:
  array of file glob patterns to lint in case not provided in `argv`
- `formatter`:
  either a string representing one of the [built-in ESLint formatters](http://eslint.org/docs/user-guide/formatters/) or a [custom formatter](http://eslint.org/docs/developer-guide/working-with-custom-formatters) function that will be called with both the `results` and the `cliEngineOptions`

## User `package.json` options

If `options.packageJson` is `true`, then options from the user’s `package.json` will be loaded and assigned as explained in [user overrides](#user-overrides). The options will have to be stored in the following format:

```json
{
  "name": "the-users-package",
  "foo-linter": {
    "options": {
    },
    "cliEngineOptions": {
    }
  }
}
```

where `foo-linter` is the linter’s `name`, as provided to `CuratedLinter`.

## User overrides

This is about implementing a policy regarding whether, what and how the user of the curated linter is allowed to override or extend, in the curated `options` and `cliEngineOptions` options objects.

When the user has [options in `package.json`](#user-packagejson-options) or when he passes `options` and `cliEngineOptions` to `lintText` or `lintFiles`, those will be merged into (clones of) your provided `options` and `cliEngineOptions` by flat assignment (`Object.assign`). This means that the user will be able to override any property of an options object.

To prevent these overrides entirely, to allow some overrides or to implement whatever policy you come up with, provide a proxy handler on a symbol property of `options` and/or `cliEngineOptions` and it will be used prior to the above mentioned assignment. The symbol is provided as `CuratedLinter.optionsProxyHandler`.

### Example

```js
const CuratedLinter = require('curated-linter')

const cliEngineOptions = {
  extends: 'standard',
  globals: ['window'],
  [CuratedLinter.optionsProxyHandler]: {
    set: (target, property, value) => {
      if (property === 'globals') {
        target[property].push(value) // notice that we push, not reassign
        return true
      }
      return false
    }
  }
}

const myLinter = CuratedLinter('myLinter', {}, cliEngineOptions)
module.exports = myLinter
```

## Curated extensions

This feature allows official, curated extensions to be automatically used if the user has any of them installed.

An official, curated extension is a separate [ESLint sharable configuration package](http://eslint.org/docs/developer-guide/shareable-configs).

Each member of a provided `options.curatedExtensions` array is expected to be a name of an ESLint shareable configuration. The `eslint-config-` prefix may be omitted. Each such package, *if the user has it installed*, will be pushed to the end of the `cliEngineOptions.baseConfig.extends` array (will be created if `undefined` and will be made into an array if `false`).
