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
	autoprefixer: ["last 2 versions", "Firefox ESR", "not IE < 11", "not ExplorerMobile < 11"]
};

let config = {
	browserSync: {
		proxy: {
			target: "localhost:8000",
			ws: true
		}
	},

	preset: "debug",
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

	transforms: [
		{
			name: "Server (Runtime)",
			config: server,
			default: true,
			type: "server",
			extraEntries: ["typings/tsd.d.ts"],
			source: "node_modules/@server/**/*.ts",
			dest: "node_modules/@server"
		},
		{
			name: "Server (Common)",
			config: server,
			default: true,
			type: "server",
			source: "node_modules/@common/**/*.ts",
			dest: "node_modules/@common"
		},
		{
			config: {
				rename: "main.js"
			},
			name: "Server (Bootstrap)",
			type: "static",
			source: "node_modules/@server/bootstrap.js",
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
			name: "Nodemon config",
			type: "static",
			source: "nodemon.json",
			dest: ""
		}
	]
};

module.exports = config;