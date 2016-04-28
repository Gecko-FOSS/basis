"use strict";

const guh = require("../package.json");
const path = require("path");

let coreVersion;

try {
	const guhCore = require(path.join(process.cwd(), "node_modules/guh-core/package.json"));
	coreVersion = guhCore.version;
} catch(e) {
	if (e.code !== "MODULE_NOT_FOUND") {
		console.error("guh encountered an unexpected error trying to locate guh-core:");
		throw e;
	}
}

console.log(`guh CLI v${ guh.version }`);

if (coreVersion) {
	console.log(`guh-core (local) v${ coreVersion }`);
}