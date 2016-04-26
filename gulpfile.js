/**
 * guh Entrypoint
 */

"use strict";

const gulp = require("gulp");
const pack = require("./package.json");

let conf;
try {
	conf = require("./build.user.conf");
} catch(e) {
	conf = require("./build.conf");
}

const main = require("guh-core/main");
const core = require("guh-core/core");

core.init(pack, conf);

gulp.task("default", main);

if (!/gulp\.js$/.test(require.main.filename)) {
	main();
}