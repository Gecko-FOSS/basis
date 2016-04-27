"use strict";

const path = require("path");

try {
	require(path.join(process.cwd(), "gulpfile"));
} catch(e) {
	if (e.code === "MODULE_NOT_FOUND") {
		console.log(`Run 'guh build' in the same directory as your Gulpfile!`);

		process.exit(-1);
	} else {
		console.error("Guh ran into a problem trying to build!");
		throw e;
	}
}