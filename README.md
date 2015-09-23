# Basis
A base build system for things of all sorts. See [CHANGES](CHANGES.md) for a complete change log.

## Requirements
- `node >=4.0`
- `typescript ~1.6`
- Ruby Sass 3.4+ (`gem install sass`)
- Sass Globbing 1.1+ (`gem install sass-globbing`)

## Using
Run `gulp` to develop in a debug build. Run `gulp build` to do a one-off debug build, or `gulp production` to build for production.

Build outputs are isolated from source files completely; by default, development builds are in `./debug` and production builds are in `./release`.

Use `src/static` for static files (images, HTML) and `src/styles` for Sass styles. Check `node_modules/@common`, `@server`, and `@client` for those specific pieces of functionality.