/*
This is the Gulpfile.

Current functionality pipelines:
- TypeScript -> JS (Server)
- TypeScript -> JS -> Browserify (Client)
- Sass -> CSS -> autoprefixer -> minify
*/

"use strict";

console.log("Loading dependencies...");

// Core dependencies
let path = require("path");
let gulp = require("gulp");
let fs = require("fs");

// Utility dependencies
let gutil = require("gulp-util");
let plumber = require("gulp-plumber");
let merge = require("merge-stream");
let source = require("vinyl-source-stream");
let buffer = require("vinyl-buffer");
let gulpif = require("gulp-if");
let concat = require("gulp-concat");
let notify = require("gulp-notify");
let livereload = require("gulp-livereload");
let watch = require("gulp-watch");
let sourcemaps = require("gulp-sourcemaps");
let rename = require("gulp-rename");
let gulpInsert = require("gulp-insert");

// Scripts
let browserify = require("browserify");
let watchify = require("watchify");
let tsify = require("tsify");
let uglify = require("gulp-uglify");
let gulpTypescript = require("gulp-typescript");
let typescript = require("typescript");

// Styles
let sass = require("gulp-ruby-sass");
let minifyCSS = require("gulp-minify-css");
let autoprefixer = require("gulp-autoprefixer");

// Runtime variables
let config;

let plumberopts = {
	errorHandler: function(err) {
		notify.onError("Error: <%= error.message %>")(err);
		this.emit("end");
	}
};

// minify?
// sourcemaps?

function assignArray(target: any[], source: any[]) {
	for (let value of source) {
		target.push(value);
	}

	return target;
}

function deepAssign(target, source) {
	for (let key in source) {
		if (source.hasOwnProperty(key)) {
			let value = source[key];

			if (Array.isArray(value)) {
				if (Array.isArray(target[key])) {
					assignArray(target[key], value);
				} else {
					target[key] = value;
				}
			} else if (typeof value === "object") {
				if (typeof target[key] === "object") {
					deepAssign(target[key], value);
				} else {
					target[key] = value;
				}
			} else {
				target[key] = value;
			}
		}
	}

	return target;
}

// Load configuration from our config file
gulp.task("config", function() {
	gutil.log("Loading configuration...");

	delete require.cache[path.resolve("./build.conf.js")];

	config = {
		debugPath: "debug",
		releasePath: "release",
		client: {
			module: "commonjs",
			sortOutput: true,
			target: "ES5",
			moduleResolution: "classic",
			typescript: typescript
		},
		server: {
			module: "commonjs",
			target: "ES5",
			moduleResolution: "classic",
			typescript: typescript
		},
		styles: {
			require: "sass-globbing"
		},
		transforms: []
	};

	try {
		let userConfig = require("./build.conf.js");

		deepAssign(config, userConfig);
	} catch(e) {
		throw "NOPE";
	}
});

// Build server scripts
gulp.task("build:server", function() {
	let merged = merge();

	getModules().forEach(function(module) {
		if (!module.transforms.server) {
			return;
		}

		let buildPath = config.isProduction ? module.productionBuildPath : module.buildPath;

		module.transforms.server.forEach(function(transform) {
			let dest = path.join(buildPath, transform.dest);
			let outFile = path.parse(dest).base;

			let stream = gulp.src([
					path.join(module.path, transform.source),
					__dirname + "/typings/tsd.d.ts"
				])
				.pipe(gulpif(config.sourcemaps, plumber(plumberopts)))
				.pipe(sourcemaps.init())
				.pipe(gulpTypescript(config.server))
				.pipe(gulpInsert.prepend("\"use strict\"; "))
				.pipe(gulpif(config.sourcemaps, sourcemaps.write("./")))
				.pipe(gulp.dest(dest));

			merged.add(stream);
		});
	});

	merged = merged
		.pipe(notify({
			message: "Server done!",
			onLast: true
		}));

	return merged;
});

// Build client scripts
gulp.task("build:client", function() {
	let merged = merge();

	getModules().forEach(function(module) {
		if (!module.transforms.client) {
			return;
		}

		let buildPath = config.isProduction ? module.productionBuildPath : module.buildPath;

		module.transforms.client.forEach(function(transform) {
			let dest = path.join(buildPath, transform.dest);
			let ppath = path.parse(dest);
			let outDir = ppath.dir;
			let outFile = ppath.base;

			let args = watchify.args;
			args.extensions = [".ts"];
			args.noParse = ["jquery"];
			args.entries = [
				path.join(module.path, transform.source),
				__dirname + "/typings/tsd.d.ts"
			];
			args.debug = true;

			let bundler = browserify(args);

			if (!singleBuild) {
				bundler = watchify(bundler);
			}

			bundler = bundler.plugin(tsify, config.client);

			function rebundle() {
				gutil.log(gutil.colors.green("Bundling client..."));

				bundler.bundle()
					.on("error", function(err) {
						notify.onError("Error: <%= error.message %>")(err);

						this.emit("end");
					})
					.pipe(source(transform.source))
					.pipe(buffer())
					.pipe(gulpif(config.sourcemaps, sourcemaps.init({loadMaps: true})))
						.pipe(gulpif(config.minify, uglify()))
						.pipe(rename(ppath.base))
						.pipe(gulpInsert.prepend("\"use strict\"; "))
					.pipe(gulpif(config.sourcemaps, sourcemaps.write("./")))
					.pipe(gulp.dest(outDir))
					.pipe(notify({
						message: "Bundling done!",
						onLast: true
					}))
					.pipe(livereload());
			}

			bundler.on("update", rebundle);
			rebundle();
		});
	});

	merged = merged
		.pipe(notify({
			message: "Client done!",
			onLast: true
		}))
		.pipe(livereload());

	return merged;
});

gulp.task("build:styles", function() {
	let merged = merge();

	getModules().forEach(function(module) {
		if (!module.transforms.styles) {
			return;
		}

		let buildPath = config.isProduction ? module.productionBuildPath : module.buildPath;

		module.transforms.styles.forEach(function(transform) {
			let dest = path.join(buildPath, transform.dest);
			let ppath = path.parse(dest);

			let stream = sass(path.join(module.path, transform.source), config.styles)
				.pipe(plumber(plumberopts))
				.pipe(rename(ppath.base))
				.pipe(autoprefixer("last 2 versions", "android 4"))
				.pipe(gulpif(config.minify, minifyCSS({
					processImport: false
				})))
				.pipe(gulpif(config.sourcemaps, sourcemaps.write("./")))
				.pipe(gulp.dest(path.join(module.path, ppath.dir)));

			merged.add(stream);
		});
	});

	merged = merged
		.pipe(notify({
			message: "Styles done!",
			onLast: true
		}))
		.pipe(livereload());

	return merged;
});

gulp.task("build:static", function() {
	let merged = merge();

	getModules().forEach(function(module) {
		if (!module.transforms.static) {
			return;
		}

		let buildPath = config.isProduction ? module.productionBuildPath : module.buildPath;

		module.transforms.static.forEach(function(transform) {
			let dest = path.join(buildPath, transform.dest);
			let stream = gulp.src(transform.source)
				.pipe(gulp.dest(dest));

			merged.add(stream);
		});
	});

	merged = merged
		.pipe(notify({
			message: "Statics done!",
			onLast: true
		}))
		.pipe(livereload());

	return merged;
});

gulp.task("build", ["config"], function() {
	let args = process.argv.slice(3);
	processArguments(args);

	return gulp.start(["_build"]);
});

gulp.task("_build", function() {
	return gulp.start(["build:server", "build:client", "build:styles", "build:static"]);
});

gulp.task("watch", function() {
	livereload.listen();

	getModules().forEach(function(module) {
		if (module.transforms.static) {
			module.transforms.static.forEach(function(transform) {
				let ppath = path.parse(transform.source);

				let wpath = path.join(module.path, ppath.dir, "**/*");
				gulp.watch(wpath, ["build:static"]);
			});
		}

		if (module.transforms.styles) {
			module.transforms.styles.forEach(function(transform) {
				let ppath = path.parse(transform.source);

				let wpath = path.join(module.path, ppath.dir, "**/*.scss");
				gulp.watch(wpath, ["build:styles"]);
			});
		}

		if (module.transforms.server) {
			module.transforms.server.forEach(function(transform) {
				let ppath = path.parse(transform.source);
				let wpath = path.join(module.path, ppath.dir, "**/*.ts");

				gulp.watch(wpath, ["build:server"]);
			});
		}
	});
});

gulp.task("production", ["config"], function() {
	_.assign(config, configPresets.production);

	let args = process.argv.slice(3);
	processArguments(args);

	return gulp.start(["_build"]);
});

gulp.task("default", ["config"], function() {
	singleBuild = false;

	let args = process.argv.slice(2);
	processArguments(args);

	return gulp.start(["_build", "watch"]);
});