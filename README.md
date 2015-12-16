# Basis
A template project for full-stack TypeScript projects.

Basis has the following goals:
- Flexible configuration
- Intuitive organization
- Isolated builds

See [CHANGES](CHANGES.md) for a complete change log.

## Requirements
- `node >=5.0`
- `nodemon` (`npm install -g nodemon`)
- Ruby Sass 3.4+ (`gem install sass`)
- Sass Globbing 1.1+ (`gem install sass-globbing`)

## Usage
The build system sets up Browsersync during development. Running `npm start` will set up `nodemon` to reload the server on code changes.

### Basic
Run `gulp` to develop in a debug build.

### Input
Use `src/static` for static files (images, HTML) and `src/styles` for Sass styles. Check `node_modules/@common`, `@server`, and `@client` for those specific pieces of functionality.

### Output
By default, development builds are in `./debug` and production builds are in `./release`.