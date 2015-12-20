#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");

const root = path.normalize(path.join(__dirname, ".."));

let out;
let name;
if (process.argv[2]) {
	out = process.argv[2];
	name = path.parse(out).name;
}

// Promise wrapper for Inquirer.js
let prompt = (questions) => {
	return new Promise(resolve => {
		inquirer.prompt(questions, answers => resolve(answers));
	});
};

// Filters a file from ./template to the output
let gFilter = (file, data) => {
	let body = fs.readFileSync(path.join(root, ".template", file)).toString("utf8");

	for (let key in data) {
		if (data.hasOwnProperty(key)) {
			body = body.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
		}
	}

	fs.writeFileSync(path.join(out, file), body);
};

let questions = [
	{
		type: "input",
		name: "projectName",
		message: "Project name?",
		default: name
	}
];

// Patterns for files we shouldn't copy
let blacklist = [
	/^node_modules[\\\/][^@]/,
	/^.git$/,
	/^.sass-cache$/,
	/^(bin|.template)$/,
	/^(debug|release)$/,
	/^package.json$/,
	/^(CHANGES.md|README.md)$/,
	/^[^\/]+\.sublime-/
];

// Let's go!
prompt(questions)
	.then(answers => {
		return prompt([
			{
				type: "input",
				name: "path",
				message: "Project path?",
				default: out || ("./" + answers.projectName)
			}
		]).then(answers2 => {
			Object.assign(answers, answers2);
			return answers;
		})
	})
	.then(answers => {
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
		// Let's handle our template files!

		let files = ["package.json", "README.md"];
		let data = {
			"package-name": name
		};

		// Filter the files from ./template
		for (let file of files) {
			gFilter(file, data);
		}

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