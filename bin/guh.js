#!/usr/bin/env node
"use strict";

const aliases = {
	h: "help",
	"-h": "help",
	"/h": "help",
	n: "new",
	u: "update"
};

let command = process.argv[2] || "help";

if (aliases[command]) {
	command = aliases[command];
}

try {
	require(`./guh-${ command }`);
} catch(e) {
	if (e.code === "MODULE_NOT_FOUND") {
		console.log(`"${ command }" isn't a valid guh command. Try "guh help"`)

		process.exit(-1);
	} else {
		throw e;
	}
}