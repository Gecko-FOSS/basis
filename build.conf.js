var config = {
	debugPath: "debug",
	releasePath: "release",
	transforms: [
		{
			default: true,
			name: "server",
			type: "server",
			source: "node_modules/@server/**/*",
			dest: ""
		},
		{
			default: true,
			name: "client",
			type: "client",
			source: "node_modules/@client/main.ts",
			dest: "static/bundle.js"
		},
		{
			default: true,
			name: "styles",
			type: "styles",
			source: "src/styles/main.scss",
			dest: "static/bundle.css"
		},
		{
			default: true,
			name: "static",
			type: "static",
			source: "src/static/**/*",
			dest: "static"
		}
	]
};

module.exports = config;