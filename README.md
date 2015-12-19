# Basis
A template project for full-stack TypeScript projects.

Basis has the following goals:
- Flexible configuration
- Intuitive organization
- Isolated builds

See [CHANGES](CHANGES.md) for a complete change log.

## Requirements
- `node >=5.0`
- Ruby Sass 3.4+ (`gem install sass`)

By default, the system also requires:
- Sass Globbing 1.1+ (`gem install sass-globbing`)

## Usage
The build system sets up Browsersync during development. Running `npm start` will set up `nodemon` to reload the server on code changes.

The build system can be run in its default configuration with `gulp`. This includes sourcemaps, no minification, live reloading, and debug output.

Flags can be set with the following syntax:
- `--flag`: enable
- `--flag=yes`, `--flag=true`: enable
- `--flag=no`, `--flag=false`: disable

The following flags can be set:
- `once`: build once, then exit
- `production`: build with production preset
	- implies `sourcemaps`, `minify`, and production build path
- `sourcemaps`: build sourcemaps for client code
- `minify`: minify client code

The following extra parameters can be set:
- `only module[,module2,...]`: only build these modules
- `except module[,module2,...]`: don't build these modules
- `gray module[,module2,...]`: build these modules even if disabled

## Files
The default transforms are:

- styles: `src/styles` -> `static/bundle.css`
- static: `src/static` -> `static`
- server: `node_modules/@server` -> `main.js`
- client: `node_modules/@client/main.ts` -> `static/bundle.js`

In debug mode (the default), these folders are contained in `debug`. In production mode, they can be found in `release`.

## License
Basis is licensed under the MIT license. See [LICENSE](LICENSE.md) for more detials.