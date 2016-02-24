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
	typescript: typescript,
	noEmitOnError: true
};

// TypeScript compiler options on the client
let browser = {
	module: "commonjs",
	sortOutput: true,
	target: "ES5",
	moduleResolution: "node",
	typescript: typescript,
	noEmitOnError: true
};

// Style options
// sass is passed straight to node-sass
let styles = {
	sass: {
	},
	autoprefixer: ["last 2 versions", "Firefox ESR", "not IE < 11", "not ExplorerMobile < 11"],
	stylelint: {
		rules: {
			"declaration-no-important": true,
			"indentation": "tab",
			"function-calc-no-unspaced-operator": true,
			"property-no-vendor-prefix": true,
			"number-leading-zero": "always"
		}
	}
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
			type: "server",
			extraEntries: ["typings/main.d.ts"],
			source: "node_modules/@server/**/*.ts",
			dest: "node_modules/@server"
		},
		{
			name: "Server (Common)",
			config: server,
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
			extraEntries: ["typings/browser.d.ts"],
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