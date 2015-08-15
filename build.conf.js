var config = {
	preset: "development",
	package: "build/package.json",
	modules: [
		{
			name: "test",
			path: __dirname,
			sass: {
				loadPath: []
			},
			server: {
				
			},
			client: {

			},
			transforms: {
				server: [
					{
						source: "src/server/*",
						dest: "build"
					}
				],
				client: [
					{
						source: "src/client/main.ts",
						dest: "build/static/bundle.js"
					}
				],
				styles: [
					{
						source: "src/styles/main.scss", 
						dest: "build/static/bundle.css"
					}
				],
				static: [
					{
						source: "src/static/**/*",
						dest: "build/static"
					}
				]
			}
		}
	]
};

module.exports = config;