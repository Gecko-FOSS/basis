# Basis
A base build system for things of all sorts. See [CHANGES](CHANGES.md) for a complete change log.

## Requirements
- `node >=4.0`
- `typescript ~1.6`
- Ruby Sass 3.4+ (`gem install sass`)
- Sass Globbing 1.1+ (`gem install sass-globbing`)

## Usage

### Basic
Run `gulp` to develop in a debug build. Run `gulp build` to do a one-off debug build, or `gulp production` to build for production.

### Input
Use `src/static` for static files (images, HTML) and `src/styles` for Sass styles. Check `node_modules/@common`, `@server`, and `@client` for those specific pieces of functionality.

### Input
Build outputs are isolated from source files completely; by default, development builds are in `./debug` and production builds are in `./release`.

### Arguments
Pass `--modules [module-name] [module-name]` to build only specific modules (specified by their name field) instead of all of them. This works for continuous debug builds, one-off debug builds, and production builds.

For example,  use `gulp build --modules core` to build only the `core` module and terminate.