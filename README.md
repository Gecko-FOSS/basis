# guh
[![npm version](https://img.shields.io/npm/v/guh.svg)](https://www.npmjs.com/package/guh)
![node version](https://img.shields.io/badge/node-%3E=5.0-brightgreen.svg)
![license](https://img.shields.io/badge/license-MIT-blue.svg)

```sh
npm install -g guh
guh new

# cd into your new project and 'npm install', then 'guh build'
# use 'npm start' to run the app!
```

A template project and generator for full-stack TypeScript and Sass (SCSS) projects.

guh has the following goals:
- Flexible configuration
- Intuitive organization
- Isolated builds
- Automated deployments

These goals are accomplished with the following technologies:
- TypeScript
- Browserify
- Sass (libsass)
- PostCSS
- Gulp
- Docker (production)

Sass compiled via guh has globbing and single-import capability via PostCSS plugins.

See [CHANGES](CHANGES.md) for a complete changelog.

## Requirements
- `node >=5.0`

## Generator CLI
Run `guh new` (like GNU) to generate a new guh-enabled project. A wizard will guide you through your setup.

## Upgrading
guh is intended to be possible to upgrade in existing projects. Simply insert a new semver-compatible version from `node_modules/app/build`; existing configurations will continue to function across minor and revision upgrades.

In guh 2.1, it will be possible to use the `guh update` command to update within semver-major versions.

## Usage
The build system can be run in its default configuration with `guh build` (or `gulp`). This loads the default preset defined in the configuration.

Flags can be set with the following syntax:
- `--flag`: enable
- `--flag=yes`, `--flag=true`: enable
- `--flag=no`, `--flag=false`: disable

### Flags
| flag          | default  | function                         |
|:------------- |:-------- |:-------------------------------- |
| `watch`       | no       | Watch the filesystem for changes |
| `sourcemaps`  | yes      | Build sourcemaps for client code |
| `minify`      | no       | Minify client code               |
| `notify`      | no       | Notify on build completion       |
| `browsersync` | no       | Run client via Browsersync       |

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
| key           | value     |
|:------------- |:--------- |
| `out`         | `./debug` |
| `watch`       | yes       |
| `sourcemaps`  | yes       |
| `minify`      | no        |
| `browsersync` | yes       | 

#### Production
| key           | value          |
|:------------- |:-------------- |
| `out`         | `./production` |
| `watch`       | no             |
| `sourcemaps`  | no             |
| `minify`      | yes            |
| `browsersync` | yes            |

The default production preset also adds an extra pipeline, copying `package.json` and `Dockerfile` to the build directory.

### Examples
To build a production build:
```
guh build --preset=production
```

To build just stylesheets once in debug mode:
```
guh build --watch=no --only=stylesheets
```

To build a debug build without sourcemaps, but with minification to `./derp`, try
```
guh build --sourcemaps=no --minify --out=derp
```

## Files
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
| `browsersync` | A configuration object passed directly to Browsersync. Omit the object to turn off Browsersync. |
| `preset` | The default preset name to use. |
| `presets` | A hashmap of defined presets. |
| `pipelines` | The list of pipelines to apply when building. |

### Pipelines
All pipelines are plain JS objects with some specific keys.

Every pipeline may specify these keys:

| key | value |
|:--- |:----- |
| `type` | (required) The type of pipeline to use. |
| `id` | An optional unique ID for this pipeline. Duplicates are removed. |
| `tags` | A list of tags to group this pipeline with others. |
| `name` | A friendly name for the pipeline. |
| `input` | (required) This pipeline's input files. |
| `output` | (required) This pipeline's output location. |
| `disabled` | Whether this pipeline is turned off by default. Defaults to false. |
| `config` | Extra parameters specific to the pipeline. |

By specifying the same `id` in two pipelines, values can be overridden in more specific contexts. Defining a pipeline with `id` of "test" in the base configuration, then defining another pipeline with the same `id` in a preset will allow the preset to override values.

For example:
```js
{
	presets: {
		production: {
			out: "production",
			pipelines: [
				{
					id: "test",
					disabled: true
				}
			]
		}
	},
	pipelines: [
		{
			id: "test",
			name: "Test the Things!",
			type: "static",
			input: "src",
			output: ""
		}
	]
}
```

Here, when running in most any preset, the `test` pipeline will copy some files around. When the `production` preset is activated, the pipeline will be disabled.

#### type `server`
The `server` pipeline compiles TypeScript files recursively, targeted at server environments.

| key | value |
|:--- |:----- |
| `extraEntries` | Extra entries to pass to the TS compiler, usually typings (`.d.ts`) files |
| `typingsOutput` | The output directory for typings files. Not outputted if omitted. |
| `moduleName` | The name of the module to export from the typings files. |
| `moduleEntryPoint` | The file marked as the entry point of the module. |

The `config` parameter is an object with the following keys:

| key | value |
|:--- |:----- |
| `typescript` | Passed directly to TypeScript |
| `partialRebuild` | Whether to rebuild only changed files. Faster, but may miss some errors. |

#### type `browser`
The `browser` pipeline compiles an entry point TypeScript file and its dependencies into a Browserify bundle.

| key | value |
|:--- |:----- |
| `extraEntries` | Extra entries to pass to the TS compiler, usually typings (`.d.ts`) files |

The `config` parameter is an object with the following keys:

| key | value |
|:--- |:----- |
| `typescript` | Passed directly to gulp-typescript |
| `browserify` | Passed directly to Browserify |

#### type `styles`
The `styles` pipeline compiles an entry point Sass file into a single CSS bundle.

The `config` parameter is an object with the following keys:

| key | value |
|:--- |:----- |
| `sass` | Passed directly to node-sass |
| `sassyImport` | Passed directly to postcss-sassy-import |
| `autoprefixer` | Passed directly to autoprefixer |
| `stylelint` | Passed directly to stylelint |

#### type `static`
The `static` pipeline copies files as-is and applies no changes to them.

| key | value |
|:--- |:----- |
| `rename` | Rename the output to this file name. Only works if the input is a single file. |

## License
guh is available under the MIT license. See [LICENSE](LICENSE.md) for more details.