"use strict";

// Load TypeScript from our dependencies
try {
	var typescript = require("typescript");
} catch(e) {
	console.error("Couldn't load some dependencies; try running 'npm install'");
	process.exit(1);
}

// TypeScript compiler options on the server
let server = {
	module: "commonjs",
	target: "ES5",
	moduleResolution: "node",
	typescript: typescript
};

// TypeScript compiler options on the client
let browser = {
	module: "commonjs",
	sortOutput: true,
	target: "ES5",
	moduleResolution: "node",
	typescript: typescript
};

// Style options
// sass is passed straight to node-sass
let styles = {
	sass: {
	},
	autoprefixer: ["last 3 versions", "Firefox ESR", "not IE < 11"]
};

let config = {
	// Direct browserSync config
	browserSync: {
		proxy: {
			target: "localhost:8000",
			ws: true
		}
	},

	preset: "debug",
	presets: {
		debug: {
			sourcemaps: true,
			minify: false,
			out: "debug"
		},
		production: {
			once: true,
			sourcemaps: false,
			minify: true,
			out: "production"
		}
	},

	transforms: [
		{
			config: server,
			default: true,
			type: "server",
			extraEntries: ["typings/tsd.d.ts"],
			source: "node_modules/@server/**/*.ts",
			dest: ""
		},
		{
			config: browser,
			type: "browser",
			extraEntries: ["typings/tsd.d.ts", "typings/fetch.d.ts"],
			source: "node_modules/@client/main.ts",
			dest: "static/bundle.js"
		},
		{
			config: styles,
			type: "styles",
			source: "node_modules/@client/main.scss",
			dest: "static/bundle.css"
		},
		{
			type: "static",
			source: "node_modules/@static/**/*.*",
			dest: "static"
		},
		{
			type: "static",
			source: ["package.json", "Dockerfile"],
			dest: ""
		}
	]
};

module.exports = config;