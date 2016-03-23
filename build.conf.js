"use strict";

const pack = require("./package.json");

// Load TypeScript from our dependencies
try {
	var typescript = require("typescript");
} catch(e) {
	console.error("Couldn't load some dependencies; try running 'npm install'");
	process.exit(1);
}

// General typescript options on both the client and server
const tsConfig = {
	module: "commonjs",
	target: "ES5",
	moduleResolution: "node",
	typescript: typescript,
	noEmitOnError: true,
	experimentalDecorators: true
};

// Compiler options on the server
// typescript goes to gulp-typescript
const server = {
	typescript: tsConfig
};

// Compiler options on the client
// typescript goes to tsify
// browserify goes to browserify
const browser = {
	typescript: Object.assign({}, tsConfig, {
		sortOutput: true
	}),

	browserify: {
	}
};

// Style options
// sass is passed to node-sass
// sassyImport is passed to postcss-sassy-import
// autoprefixer is passed to autoprefixer
// stylelint is passed to stylelint
const styles = {
	sass: {
	},
	sassyImport: {
	},
	autoprefixer: ["last 2 versions", "Firefox ESR", "not IE < 11", "not ExplorerMobile < 11"],
	stylelint: {
		rules: {
			"declaration-no-important": true,
			"declaration-block-no-duplicate-properties": true,
			"function-calc-no-unspaced-operator": true,
			"property-no-vendor-prefix": true,
			"number-leading-zero": "always"
		}
	}
};

const config = {
	// Omit this to turn off Browsersync
	// Passed to Browsersync
	browsersync: {
		proxy: {
			target: "localhost:8000",
			ws: true
		}
	},

	// Default preset
	preset: "debug",

	// Collection of presets
	presets: {
		debug: {
			watch: true,
			sourcemaps: true,
			minify: false,
			out: "debug"
		},
		production: {
			watch: false,
			sourcemaps: false,
			minify: true,
			out: "production",
			pipelines: [
				{
					name: "Metadata",
					type: "static",
					input: ["package.json", "Dockerfile"],
					output: ""
				}
			]
		}
	},

	// List of pipelines to build and use
	pipelines: [
		// Build primary server files (node_modules/@server/)
		{
			id: "server-runtime",
			name: "Server (Runtime)",
			config: server,
			type: "server",

			input: "node_modules/@server/**/*.ts",
			output: "node_modules/@server/",

			extraEntries: ["typings/main.d.ts"],

			typingsOutput: "typings/index.d.ts",
			moduleName: pack.name,
			moduleEntryPoint: "main.ts"
		},

		// Builds Isomorphic common files (node_modules/@common/)
		{
			id: "server-common",
			name: "Server (Common)",
			config: server,
			type: "server",

			input: "node_modules/@common/**/*.ts",
			output: "node_modules/@common/",

			extraEntries: ["typings/main.d.ts"]
		},

		// Copies the server bootstrap file
		{
			id: "server-bootstrap",
			name: "Server (Bootstrap)",
			type: "static",

			input: "node_modules/@server/bootstrap.js",
			output: "",

			rename: "main.js"
		},

		// Builds a Browserify bundle of node_modules/@client/
		{
			config: browser,
			type: "browser",

			input: "node_modules/@client/main.ts",
			output: "static/bundle.js",

			extraEntries: ["typings/browser.d.ts"],
		},

		// Compiles all style files
		{
			config: styles,
			type: "styles",

			input: "node_modules/@client/main.scss",
			output: "static/bundle.css"
		},

		// Copies static files to static/
		{
			type: "static",

			input: "node_modules/@static/**/*.*",
			output: "static/"
		},

		// Copies nodemon configuration
		{
			name: "Nodemon config",
			type: "static",

			input: "nodemon.json",
			output: ""
		}
	]
};

module.exports = config;