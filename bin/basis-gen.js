#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs-extra");
const readline = require("readline");

const root = path.normalize(path.join(__dirname, ".."));

let rl = readline.createInterface({
	output: process.stdout,
	input: process.stdin
});

let out;
let name;
if (process.argv[2]) {
	out = process.argv[2];
	name = path.parse(out).name;
}

// Promise wrapper for Inquirer.js
let prompt = (text, fallback) => {
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

let answers = {};

// Patterns for files we shouldn't copy
let blacklist = [
	/^node_modules[\\\/][^@]/,
	/^.git$/,
	/^.sass-cache$/,
	/^bin$/,
	/^(debug|production)$/,
	/^package.json$/,
	/^(CHANGES.md|README.md|LICENSE.md)$/,
	/^[^\/]+\.sublime-/
];

let README = (name) => `
# ${name}
This project was generated with [Basis](https://github.com/LPGhatguy/basis).
`.trim();

// Let's go!
prompt(`Project name? ${name ? "(" + name + ")" : ""} `, name)
	.then(projectName => {
		answers.projectName = projectName;
		let existing = out || ("./" + projectName);

		return prompt(`Project path? ${existing} `, existing);
	})
	.then(projectPath => {
		answers.path = projectPath;
		rl.close();
	})
	.then(() => {
		out = answers.path || path;
		name = answers.name || name;

		if (!path.isAbsolute(out)) {
			out = path.join(process.cwd(), out);
		}

		// We're building from `root` to `out`

		fs.mkdirsSync(out);

		return new Promise((resolve, reject) => {
			fs.copy(root, out, {
				filter: (file) => {
					let relative = path.relative(root, file);

					for (let reg of blacklist) {
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
				}

				resolve();
			});
		});
	}).then(() => {
		// Write a readme
		fs.writeFileSync(path.join(out, "README.md"), README(name));

		// Write new package.json
		let packBody = fs.readFileSync(path.join(root, "package.json")).toString("utf8");
		let pack = JSON.parse(packBody);
		pack.name = name;
		pack.version = "1.0.0";
		pack.description = "Generated with basis-gen";
		packBody = JSON.stringify(pack, null, 2);

		fs.writeFileSync(path.join(out, "package.json"), packBody);

		// If the user has a sublime-project file, let's copy it!
		if (fs.lstatSync(path.join(root, "basis.sublime-project"))) {
			let body = fs.readFileSync(path.join(root, "basis.sublime-project")).toString("utf8");

			body = body.replace(/basis/g, name);

			fs.writeFileSync(path.join(out, `${name}.sublime-project`), body);
		}

		console.log("Scaffolded new project at ", out);
	}).catch(e => {
		console.error(e);
	})