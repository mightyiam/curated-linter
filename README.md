[![Build Status](https://travis-ci.org/mightyiam/curated-linter.svg?branch=master)](https://travis-ci.org/mightyiam/curated-linter)
[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# curated-linter

Makes curated ESLint linters, like [standard](http://standardjs.com/)

## What is a curated linter?

- a linter based on [ESLint’s `CLIEngine`](http://eslint.org/docs/developer-guide/nodejs-api#cliengine)
- has a name (e.g. "standard")
- has a curated ESLint configuration
- probably has a curated set of [ESLint rules](http://eslint.org/docs/rules/)
- the extent to which the user is able to override and/or extend the linter’s configuration [is configurable](#user-overrides)
- may or may not allow [using an official, curated, set of extensions](#curated-extensions)
- may have either or both of an [API](#api) and a [CLI](#cli)
- [API](#api) may have either or both of `lintText` and `lintFiles`, which represent [`executeOnText`](http://eslint.org/docs/developer-guide/nodejs-api#executeontext) and [`executeOnFiles`](http://eslint.org/docs/developer-guide/nodejs-api#executeonfiles), respectively
- CLI may use a built-in [ESLint formatter](http://eslint.org/docs/user-guide/formatters/), or a [custom](http://eslint.org/docs/developer-guide/working-with-custom-formatters) one

## Example

`index.js`:
```js
const CuratedLinter = require('curated-linter')

const getOptions = () => ({
  gitIgnore: true,
  cliEngineOptions: {
    ignore: false,
    useEslintrc: false,
    rules: {
      'id-blacklist': ['foo', 'bar']
      // ...
    }
  }
})

const noFoobarLinter = CuratedLinter('nofoobar', getOptions)

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

### `CuratedLinter(name, getOptions)`

Creates a curated linter

- `name`:
  machine name of the linter for use as key in users’ `package.json`
- `getOptions`: a function that always returns your `options` object:
  - [`packageJson`](#user-packagejson-options)
  - `gitIgnore`:
    whether to ignore files that are ignored by a possibly existing `.gitignore`
  - [`curatedExtensions`](#curated-extensions)
  - `CLIEngineOptions`:
    will be passed to [`CLIEngine`](http://eslint.org/docs/developer-guide/nodejs-api#cliengine)

Returns a [`curatedLinter`](#curatedlinter)

### `curatedLinter`

The curated linter object. Its properties are described below:

#### `lintText(text, options)`

Lints provided text

- `text`:
  text to lint
- [`options`](#user-overrides)

#### `lintFiles(files, options)`

Lints files

- `files`:
  array of file glob patterns
- [`options`](#overriding-and-extending)

#### `cli(defaultFiles, formatter, argv)`

The CLI API

- `defaultFiles`:
  array of file glob patterns to lint in case not provided in `argv`
- `formatter`:
  either a string representing one of the [built-in ESLint formatters](http://eslint.org/docs/user-guide/formatters/) or a [custom formatter](http://eslint.org/docs/developer-guide/working-with-custom-formatters) function that will be called with both the `results` and the `CLIEngineOptions`

## User `package.json` options

If `options.packageJson` is `true`, then options from the user’s `package.json` will be loaded and assigned as explained in [user overrides](#user-overrides). The options will have to be stored in the following format:

```json
{
  "name": "the-users-package",
  "foo-linter": {
    "CLIEngineOptions": {
      "rules": {
        "yoda": "error"
      }
    }
  }
}
```

where `foo-linter` is the linter’s `name`, as provided to `CuratedLinter`.

## User overrides

This is about implementing a policy regarding whether, what and how the user of the curated linter is allowed to override or extend, in the curated `options` object.

You may implement whatever policy you like, by having your `getOptions` return a version of `options` that is somehow protected. For example, you may protect it using a deep `Object.freeze` or nested proxies.

When the user has [options in `package.json`](#user-packagejson-options) or when he passes `options` to `lintText` or `lintFiles`, those will be merged into the `options` that your `getOptions` returned by [deep assignment](https://www.npmjs.com/package/deep-assign). This means that, if your `getOptions` provides an unprotected `options`, the user will be able to override any property in that tree.

### Example of protected `options` using a proxy

In the following example, the only allowed override is that globals can be added.

```js
const CuratedLinter = require('curated-linter')

const noSetHandler = {
  set: () => false
}

const appendHandler = {
  set: (target, property, value) => {
    target.push(value) // convert setting into appending
    return true
  }
}

const getOptions = () => (new Proxy({
  CLIEngineOptions: new Proxy({
    extends: 'standard',
    globals: new Proxy(['window'], appendHandler)
  }, noSetHandler)
}, noSetHandler))

const myLinter = CuratedLinter('myLinter', getOptions)
module.exports = myLinter
```

## Curated extensions

This feature allows official, curated extensions to be automatically used if the user has any of them installed.

An official, curated extension is a separate [ESLint sharable configuration package](http://eslint.org/docs/developer-guide/shareable-configs).

Each member of a provided `options.curatedExtensions` array is expected to be a name of an ESLint shareable configuration. The `eslint-config-` prefix may be omitted. Each such package, *if the user has it installed*, will be pushed to the end of the `options.CLIEngineOptions.baseConfig.extends` array (will be created if `undefined` and will be made into an array if `false`).
