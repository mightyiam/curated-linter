[![Build Status](https://travis-ci.org/mightyiam/curated-linter.svg?branch=master)](https://travis-ci.org/mightyiam/curated-linter)
[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
[![codecov](https://codecov.io/gh/mightyiam/curated-linter/branch/master/graph/badge.svg)](https://codecov.io/gh/mightyiam/curated-linter)

# curated-linter

Makes curated ESLint linters, like [standard](http://standardjs.com/)

## What is a curated linter?

- a linter based on [ESLint’s `CLIEngine`](http://eslint.org/docs/developer-guide/nodejs-api#cliengine)
- probably has a name (e.g. "standard")
- probably has curated ESLint [configuration](http://eslint.org/docs/user-guide/configuring) and [rules](http://eslint.org/docs/rules/)
- the extent to which the end-user is able to override and/or extend the curated configuration [is configurable](#end-user-overrides)
- may or may not allow [using an official, curated, set of extensions](#curated-extensions)
- may have either or both of a [(promise) API](#api) and a [CLI](#cli)
- CLI may report using a custom [ESLint formatter](http://eslint.org/docs/user-guide/formatters/)
- and more features, that are not in ESLint

## Example

In this example we create our curated linter as an npm package.

### `package.json`:
```json
{
	"name": "nofoobar",
	"main": "index.js",
	"bin": { "nofoobar": "index.js" }
}
```

Yes, the CLI is the same module as the API.

### `index.js`

For instantiation, we do not provide an `options` object—we provide a function that will return a new `options` object with each call—a getter.

```js
const CuratedLinter = require('curated-linter')

// `options` getter function
const getOptions = () => ({
  name: 'nofoobar', // CLI name and `package.json` config key
  packageJson: true, // read end user config from `package.json`
  gitIgnore: true, // (also) ignore what git ignores
  formatter: (results, options) => { // customize your CLI error output
    return `${options.name}: Nope. Do not use \`foo\` or \`bar\``
    // or… something more real than this
  },
  CLIEngineOptions: { // options for ESLint’s `CLIEngine`
    ignore: false,
    useEslintrc: false,
    rules: { // http://eslint.org/docs/rules/
      'id-blacklist': ['foo', 'bar'] // http://eslint.org/docs/rules/id-blacklist
      // your usage may include all your favorite rules!
    }
    // for more `CLIEngine` options: http://eslint.org/docs/developer-guide/nodejs-api#cliengine
  }
  // not all curated-linter options are not used in this example
})

const noFoobar = new CuratedLinter(getOptions)

// The API is ready. Now just export it!
module.exports = noFoobar
```

This example hopefully provided you with a basic understanding. Read below for the API and some awesome features.

## API

### `new CuratedLinter(getOptions)`

> Constructs a curated linter

`getOptions` must be a function that returns a new [`options`](#options) object with each call.

### `options`

> Contains all of the configuration, policy and behavior of a desired curated linter

The `options` object is provided to the curated linter instance firstly via the `getOptions` [constructor](#new-curatedlintergetoptions) argument.

It can also be provided to the [`lintText`](#linttexttext-options) and [`lintFiles`](#lintfilesfiles-options) methods, for the sake of [possibly allowing the end users to override or extend the curated configuration](#end-user-overrides).

Following are all of the possible properties of `options`:

#### `name`

> Machine name of the curated linter

Must be provided if the CLI feature is to be used.

#### `packageJson`

> Whether to allow [end user configuration via `package.json`](#end-user-configuration-via-packagejson)

#### `gitIgnore`

> Whether to (also) ignore according to `.gitignore`

This determines whether, in addition to any other ignore configuration, to ignore files that are ignored by a possibly existing `.gitignore`.

#### `ignore`

> List of [glob](https://www.npmjs.com/package/glob#glob-primer) file patterns to ignore

#### `curatedExtensions`

> List of [official curated extensions](#curated-extensions)

#### `CLIEngineOptions`

> Will be passed to [`CLIEngine`](http://eslint.org/docs/developer-guide/nodejs-api#cliengine)

This is where you may define your rules, plugins, etc.

Tip: if you can’t find a certain property on this interface, take a look at the `baseConfig` property.

#### `formatter`

> Formats the CLI error messages

If this is a string, it must represent a [built-in ESLint formatter](http://eslint.org/docs/user-guide/formatters/).

Otherwise, it must be a function. It will be called as `formatter(results, options)`. Except for the `options` argument, the signature is identical to [ESLint formatters](http://eslint.org/docs/developer-guide/working-with-custom-formatters).

The `options` provided will be post [user overrides](#user-overrides).

#### `defaultFiles`

> Files to lint by default

Whether via the CLI or via `#lintFiles`, if no files provided, these will be linted.

An array of [glob](https://www.npmjs.com/package/glob#glob-primer)s.

### `#lintText(text, options)`

> Lints provided text

- `text`: text (source code) to lint
- [`options`](#options)
- returns a promise of the [ESLint results object](#the-eslint-results-object)

### `#lintFiles(files, options)`

> Lints files

- `files`: array of [glob](https://www.npmjs.com/package/glob#glob-primer)s of files to lint
- [`options`](#options)
- returns a promise of the [ESLint results object](#the-eslint-results-object)

### The ESLint results object

> Resolved value of promises returned by `#lintFiles` and `#lintText`

Documentation of the ESLint results object can be found in [ESLint’s `#executeOnFiles` documentation](http://eslint.org/docs/developer-guide/nodejs-api#executeonfiles).

## End user CLI

To provide end users with a CLI, the [`options.name`](#name) property must be provided.

Also, there must be a [`package.json` `bin` property](https://docs.npmjs.com/files/package.json#bin), like so:

```json
{
  "name": "nofoobar",
  "bin": {
    "nofoobar": "index.js"
  }
}
```

The value of the property under `bin` (here `"index.js"`) must be *a module where `CuratedLinter` is instantiated*. No further method calling required. Thus your [main export](https://docs.npmjs.com/files/package.json#main) and your `bin` can be the same module.

To allow this unified `main`/`bin` "magic" <!-- add link to code -->, the property under the `bin` property *must be identical* to your [`options.name`](#name).

## End user configuration via `package.json`

If [`options.packageJson`](#packagejson-1) is `true`, then options from a *certain property* of the end user’s `package.json` will be read and applied as explained in [user overrides](#user-overrides). That *certain property* is [`options.name`](#name).

For example if `options.name === 'nofoobar'`:

```json
{
  "name": "the-users-package",
  "nofoobar": {
    "ignore": ["**/*.test.js"]
  }
}
```

## End user overrides

This is about implementing a policy regarding *whether*, *what* and *how* the end user of the curated linter is allowed to override or extend, the curated `options`.

You may implement whatever policy you like, by having your `getOptions` return a version of `options` that is protected using proxies.

Whether from [end user options in `package.json`](#end-user-configuration-via-packagejson) or from the end user passing `options` to `lintText` or `lintFiles`, those user `options` will be merged into the `options` that your `getOptions` returned, using [deep assignment](https://www.npmjs.com/package/deep-assign). This means that, if your `getOptions` provides an unprotected `options`, the user will be able to override any property in that tree.

Overrides occur on method invocation (the CLI also uses those methods). On each such invocation, your curated `options` are retrieved by calling your `getOptions`. Thus, overrides applied on one method call will *not* persist on the instance.

### Example of protected `options` using proxies

The only allowed override is that the `id-blacklist` rule can be *added more identifiers*:

```js
const CuratedLinter = require('curated-linter')

const frozen = {
  set: () => false
}

const append = {
  set: (target, property, value) => {
    target.push(value) // convert setting into appending
    return true
  }
}

const getOptions = () => (new Proxy({
  CLIEngineOptions: new Proxy({
    name: 'nofoobar',
    rules: new Proxy({
      'id-blacklist': new Proxy([
        'foo',
        'bar'
      ], append)
    }, frozen)
  }, frozen)
}, frozen))

const noFooBar = new CuratedLinter(getOptions)
module.exports = noFooBar
```

As you can see, using proxies, it is possible to implement any override/extension policy.

## Curated extensions

This feature allows official, curated extensions to be automatically used if the end user has any of them installed.

An official, curated extension is a separate [ESLint sharable configuration package](http://eslint.org/docs/developer-guide/shareable-configs).

Each member of a provided [`options.curatedExtensions`](#curatedextensions) array is expected to be a name of an ESLint shareable configuration. The `eslint-config-` prefix may be omitted. Each such package, *if the end user has it installed*, will be pushed to the end of the [`options.CLIEngineOptions`](#cliengineoptions)`.baseConfig.extends` array (will be created if `undefined` and will be made into an array if `false`).
