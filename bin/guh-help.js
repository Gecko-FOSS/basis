"use strict";

const guh = require("../package");

const helpText = `
guh CLI v${ guh.version }

Usage:
    guh help: Show this screen
    guh version: Show the current version
    guh build: Build a guh-enabled project
    guh new [name]: Make a new guh-enabled project
    guh update [path]: Update an existing guh-enabled project
`.trim();

console.log(helpText);