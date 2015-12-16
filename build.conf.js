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
	require: "sass-globbing"
};

let config = {
	proxy: "localhost:8000",
	once: false,
	debug: true,

	debugPath: "debug",
	releasePath: "release",

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
			default: true,
			type: "browser",
			extraEntries: ["typings/tsd.d.ts", "typings/fetch.d.ts"],
			source: "node_modules/@client/main.ts",
			dest: "static/bundle.js"
		},
		{
			config: styles,
			default: true,
			type: "styles",
			source: "src/styles/main.scss",
			dest: "static/bundle.css"
		},
		{
			default: true,
			type: "static",
			source: "src/static/**/*.*",
			dest: "static"
		}
	]
};

module.exports = config;