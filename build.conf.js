"use strict";

try {
	var typescript = require("typescript");
} catch(e) {
	console.log("Couldn't load 'typescript'; try running 'npm install'");
}

let server = {
	module: "commonjs",
	target: "ES5",
	moduleResolution: "node",
	typescript: typescript
};

let browser = {
	module: "commonjs",
	sortOutput: true,
	target: "ES5",
	moduleResolution: "node",
	typescript: typescript
};

let styles = {
	sass: {
		require: "sass-globbing"
	},
	autoprefixer: ["last 3 versions", "Firefox ESR", "not IE < 11"]
};

let config = {
	proxy: "localhost:8000",

	preset: "debug",
	presets: {
		debug: {
			sourcemaps: true,
			minify: false,
			out: "debug"
		},
		release: {
			once: true,
			sourcemaps: false,
			minify: true,
			out: "release"
		}
	},

	transforms: [
		{
			config: server,
			default: true,
			type: "server",
			extraEntries: ["typings/tsd.d.ts"],
			source: "node_modules/@server/**/*.*",
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
			source: "src/styles/main.scss",
			dest: "static/bundle.css"
		},
		{
			type: "static",
			source: "src/static/**/*.*",
			dest: "static"
		}
	]
};

module.exports = config;