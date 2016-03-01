#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs-extra");
const readline = require("readline");

const root = path.normalize(path.join(__dirname, ".."));

let genPack;
{
	const body = fs.readFileSync(path.join(root, "package.json"));
	genPack = JSON.parse(body);
}

const helpText = `
guh generator v${genPack.version}

Usage:
	guh help: Show this screen
	guh new [name]: Make a new guh-enabled project
`.trim();

let command = process.argv[2] || "help";

if (command === "help" || command === "h") {
	console.log(helpText);
	process.exit(0);
} else if (command !== "new") {
	console.log(`Unknown command "${command}" -- try "guh help"`);
	process.exit(-1);
}

console.log("guh generator v" + genPack.version);

const rl = readline.createInterface({
	output: process.stdout,
	input: process.stdin
});

let out;
let name;
if (process.argv[3]) {
	out = process.argv[3];
	name = path.parse(out).name;
}

// Promise wrapper for readline
const prompt = (text, fallback) => {
	return new Promise(resolve => {
		rl.question(text, answer => {
			if (!answer) {
				resolve(fallback);
				return;
			}

			resolve(answer);
		})
	});
};

const answers = {};

// Patterns for files we shouldn't copy
const blacklist = [
	/^node_modules[\\\/][^@]/,
	/^.git$/,
	/^.sass-cache$/,
	/^bin$/,
	/^(debug|production)$/,
	/^package.json$/,
	/^(CHANGES.md|README.md|LICENSE.md)$/,
	/^[^\/]+\.sublime-/
];

// We use these dependencies only in the generator.
const blackDeps = new Set(["fs-extra"]);

const README = (name) => `
# ${name}
This project was generated with [guh](https://github.com/LPGhatguy/guh).
`.trim();

// Let's go!
prompt(`Project name? ${name ? "(" + name + ")" : ""} `, name)
	.then(projectName => {
		answers.projectName = projectName;
		const existing = out || ("./" + projectName);

		return prompt(`Project path? ${existing} `, existing);
	})
	.then(projectPath => {
		answers.path = projectPath;
		rl.close();
	})
	.then(() => {
		out = answers.path || out;
		name = answers.projectName || name;

		if (!path.isAbsolute(out)) {
			out = path.join(process.cwd(), out);
		}

		// We're building from `root` to `out`

		fs.mkdirsSync(out);

		return new Promise((resolve, reject) => {
			fs.copy(root, out, {
				filter: (file) => {
					const relative = path.relative(root, file);

					for (const reg of blacklist) {
						if (reg.test(relative)) {
							return false;
						}
					}

					return true;
				}
			}, (err) => {
				if (err) {
					console.error(err);
					reject(err);

					return;
				}

				resolve();
			});
		});
	}).then(() => {
		// Write a readme
		fs.writeFileSync(path.join(out, "README.md"), README(name));

		// Write new package.json
		let packBody = fs.readFileSync(path.join(root, "package.json")).toString("utf8");
		const pack = JSON.parse(packBody);
		pack.name = name;
		pack.version = "1.0.0";
		pack.description = "Generated with guh v" + genPack.version;

		const deps = pack.dependencies;
		const newDeps = {};
		for (const key in deps) {
			if (deps.hasOwnProperty(key)) {
				if (!blackDeps.has(key)) {
					newDeps[key] = deps[key];
				}
			}
		}
		pack.dependencies = newDeps;

		packBody = JSON.stringify(pack, null, 2);

		fs.writeFileSync(path.join(out, "package.json"), packBody);

		// If the user has a sublime-project file, let's copy it!
		if (fs.lstatSync(path.join(root, "guh.sublime-project"))) {
			let body = fs.readFileSync(path.join(root, "guh.sublime-project")).toString("utf8");

			body = body.replace(/guh/g, name);

			fs.writeFileSync(path.join(out, `${name}.sublime-project`), body);
		}

		console.log("Scaffolded new project at ", out);
	}).catch(e => {
		console.error(e);
	});