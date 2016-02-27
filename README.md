# Guh
[![npm version](https://img.shields.io/npm/v/guh.svg)](https://www.npmjs.com/package/guh)
![node version](https://img.shields.io/node/v/guh.svg)
![license](https://img.shields.io/github/license/LPGhatguy/guh.svg)

```sh
npm install -g guh
guh [project-name]
```

A template project and generator for full-stack TypeScript projects.

guh has the following goals:
- Flexible configuration
- Intuitive organization
- Isolated builds
- Automated deployments

These goals are accomplished with the following technologies:
- TypeScript
- Browserify
- Sass (libsass)
- Gulp
- Docker (production)

Sass compiled via guh has globbing and single-import enabled.

See [CHANGES](CHANGES.md) for a complete changelog.

## Requirements
- `node >=5.0`

## Generator
Run `guh [project-name]` to generate a new guh-enabled project. A wizard will guide you through your setup.

## Usage
The build system can be run in its default configuration with `gulp`. This loads the default preset defined in the configuration.

Flags can be set with the following syntax:
- `--flag`: enable
- `--flag=yes`, `--flag=true`: enable
- `--flag=no`, `--flag=false`: disable

### Flags
| flag         | default  | function                         |
|:------------ |:-------- |:-------------------------------- |
| `watch`      | no       | Watch the filesystem for changes |
| `sourcemaps` | yes      | Build sourcemaps for client code |
| `minify`     | no       | Minify client code               |
| `notify`     | no       | Notify on build completion       |

*Default values are used if the configuration does not specify a value and value was given on the CLI.*

### Parameters
| parameter                       | function                             |
|:------------------------------- |:------------------------------------ |
| `--out=PATH`                    | Outputs result into `PATH`           |
| `--preset=PRESET`               | Sets build preset to `PRESET`        |
| `--only=MODULE[,MODULE2,...]`   | Build only these modules             |
| `--except=MODULE[,MODULE2,...]` | Don't build these modules            |
| `--gray=MODULE[,MODULE2,...]`   | Build these modules even if disabled |

### Presets
Presets set default values for many of these flags and parameters.

#### Debug
| key          | value     |
|:------------ |:--------- |
| `out`        | `./debug` |
| `watch`      | yes       |
| `sourcemaps` | yes       |
| `minify`     | no        |

#### Production
| key          | value          |
|:------------ |:-------------- |
| `out`        | `./production` |
| `watch`      | no             |
| `sourcemaps` | no             |
| `minify`     | yes            |

The default production preset also adds an extra transform, copying `package.json` and `Dockerfile` to the build directory.

### Examples
To build a production build:
```
gulp --preset=production
```

To build just stylesheets once in debug mode:
```
gulp --watch=no --only=stylesheets
```

To build a debug build without sourcemaps, but with minification to `./derp`, try
```
gulp --sourcemaps=no --minify --out=derp
```

## Files
The default transforms are:

| type   | input                            | output              |
|:------ |:-------------------------------- |:------------------- |
| styles | `node_modules/@client/main.scss` | `static/bundle.css` |
| static | `node_modules/@static`           | `static`            |
| static | `Dockerfile`, `package.json`     | `.`                 |
| server | `node_modules/@server`           | `.`                 |
| client | `node_modules/@client/main.ts`   | `static/bundle.js`  |

In debug mode (the default), the output is contained in `debug`. In production mode, it can be found in `production`.

## Configuration
The primary configuration is located inside `build.conf.js`. guh will also load `build.user.conf.js` if it exists, which will take precedence over the primary configuration.

It's recommended that the user config file stays out of version control. It should be based on the following code to patch the primary config:

```js
"use strict";

let conf = require("./build.conf");

// modify conf

module.exports = conf;
```

### Top-Level Configuration
The configuration object has a number of fields that affect compilation globally.

| key | value |
|:--- |:----- |
| `browerSync` | A configuration object passed directly to browserSync. Omit the object to turn off browserSync. |
| `preset` | The default preset name to use. |
| `presets` | A hashmap of defined presets. |
| `transforms` | The list of transforms to apply when building. |

### Transforms
All transforms are plain JS objects with some specific keys.

Every transform may specify these keys:

| key | value |
|:--- |:----- |
| `type` | (required) The type of transform to use. |
| `id` | An optional unique ID for this transform. Duplicates are removed. |
| `name` | A friendly name for the transform. |
| `source` | (required) This transform's input files. |
| `dest` | (required) This transform's output location. |
| `disabled` | Whether this transform is turned off by default. Defaults to false. |
| `config` | Extra parameters specific to the transform. |

By specifying the same `id` in two transforms, values can be overridden in more specific contexts. Defining a transform with `id` of "test" in the base configuration, then defining another transform with the same `id` in a preset will allow the preset to override values.

For example:
```js
{
	presets: {
		production: {
			out: "production",
			transforms: [
				{
					id: "test",
					disabled: true
				}
			]
		}
	},
	transforms: [
		{
			id: "test",
			name: "Test the Things!",
			type: "static",
			source: "src",
			dest: ""
		}
	]
}
```

Here, when running in most any preset, the `test` transform will copy some files around. When the `production` preset is activated, the transform will be disabled.

#### type `server`
The `server` transform compiles TypeScript files recursively, targeted at server environments.

The `config` parameter is passed directly to the TypeScript compiler.

| key | value |
|:--- |:----- |
| `extraEntries` | Extra entries to pass to the TS compiler, usually typings (`.d.ts`) files |

#### type `browser`
The `browser` transform compiles an entry point TypeScript file and its dependencies into a Browserify bundle.

The `config` parameter is passed directly to the TypeScript compiler.

| key | value |
|:--- |:----- |
| `extraEntries` | Extra entries to pass to the TS compiler, usually typings (`.d.ts`) files |
| `rootDir` | The root to resolve absolute paths from. Only relevant with 'classic' resolution. |

#### type `styles`
The `styles` transform compiles an entry point Sass file into a single CSS bundle.

The `config` parameter is an object with the following keys:

| key | value |
|:--- |:----- |
| `sass` | Passed directly to node-sass |
| `autoprefixer` | Passed directly to autoprefixer |
| `stylelint` | Passed directly to stylelint |

#### type `static`
The `static` transform copies files as-is and applies no changes to them.

The `config` parameter is an object with the following keys:

| key | value |
|:--- |:----- |
| `rename` | Rename the output to this file name. Only works if the input is a single file. |

## License
guh is available under the MIT license. See [LICENSE](LICENSE.md) for more details.