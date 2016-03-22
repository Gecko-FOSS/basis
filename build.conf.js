"use strict";

// Load TypeScript from our dependencies
try {
	var typescript = require("typescript");
} catch(e) {
	console.error("Couldn't load some dependencies; try running 'npm install'");
	process.exit(1);
}

// Compiler options on the server
// typescript goes to gulp-typescript
const server = {
	typescript: {
		module: "commonjs",
		target: "ES5",
		moduleResolution: "node",
		typescript: typescript,
		noEmitOnError: true
	}
};

// Compiler options on the client
// typescript goes to tsify
// browserify goes to browserify
const browser = {
	typescript: {
		module: "commonjs",
		sortOutput: true,
		target: "ES5",
		moduleResolution: "node",
		typescript: typescript,
		noEmitOnError: true
	},

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
	browserSync: {
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
			transforms: [
				{
					name: "Metadata",
					type: "static",
					source: ["package.json", "Dockerfile"],
					dest: ""
				}
			]
		}
	},

	// List of transforms to apply
	transforms: [
		// Build primary server files (node_modules/@server/)
		{
			id: "server-runtime",
			name: "Server (Runtime)",
			config: server,
			type: "server",
			extraEntries: ["typings/main.d.ts"],
			source: "node_modules/@server/**/*.ts",
			dest: "node_modules/@server/"
		},

		// Builds Isomorphic common files (node_modules/@common/)
		{
			id: "server-common",
			name: "Server (Common)",
			config: server,
			type: "server",
			extraEntries: ["typings/main.d.ts"],
			source: "node_modules/@common/**/*.ts",
			dest: "node_modules/@common/"
		},

		// Copies the server bootstrap file
		{
			id: "server-bootstrap",
			name: "Server (Bootstrap)",
			config: {
				rename: "main.js"
			},
			type: "static",
			source: "node_modules/@server/bootstrap.js",
			dest: ""
		},

		// Builds a Browserify bundle of node_modules/@client/
		{
			config: browser,
			type: "browser",
			extraEntries: ["typings/browser.d.ts"],
			source: "node_modules/@client/main.ts",
			dest: "static/bundle.js"
		},

		// Compiles all style files
		{
			config: styles,
			type: "styles",
			source: "node_modules/@client/main.scss",
			dest: "static/bundle.css"
		},

		// Copies static files to static/
		{
			type: "static",
			source: "node_modules/@static/**/*.*",
			dest: "static/"
		},

		// Copies nodemon configuration
		{
			name: "Nodemon config",
			type: "static",
			source: "nodemon.json",
			dest: ""
		}
	]
};

module.exports = config;