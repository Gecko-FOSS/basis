# Basis
```sh
git clone https://github.com/LPGhatguy/basis.git
npm install ./basis -g
basis-gen [project-name]
```

A template project and generator for full-stack TypeScript projects.

Basis has the following goals:
- Flexible configuration
- Intuitive organization
- Isolated builds

See [CHANGES](CHANGES.md) for a complete changelog.

## Requirements
- `node >=5.0`
- Ruby Sass 3.4+ (`gem install sass`)

By default, the system also requires:
- Sass Globbing 1.1+ (`gem install sass-globbing`)

## Generator
Run `basis-gen [project-name]` to generate a new Basis-enabled project. A wizard will guide you through your setup.

## Usage
The build system can be run in its default configuration with `gulp`. This loads the default preset defined in the configuration.

Flags can be set with the following syntax:
- `--flag`: enable
- `--flag=yes`, `--flag=true`: enable
- `--flag=no`, `--flag=false`: disable

The following flags can be set:
- `once`: build once, then exit
- `sourcemaps`: build sourcemaps for client code
- `minify`: minify client code

The following parameters can be set:
- `--out=PATH`: output path for code
- `--preset=PRESET`: preset to load
- `--only=MODULE[,MODULE2,...]`: only build these modules
- `--except=MODULE[,MODULE2,...]`: don't build these modules
- `--gray=MODULE[,MODULE2,...]`: build these modules even if disabled

### Examples
To build a single production build:
```
gulp --once --preset=production
```

To build just stylesheets once in debug mode without minifying them:
```
gulp --once --only=stylesheets
```

To build a debug build without sourcemaps to `./derp`, try
```
gulp --sourcemaps=no --out=derp
```

## Files
The default transforms are:

- styles: `node_modules/@client/main.scss` -> `static/bundle.css`
- static: `src/static` -> `static`
- server: `node_modules/@server` -> `main.js`
- client: `node_modules/@client/main.ts` -> `static/bundle.js`

In debug mode (the default), these folders are contained in `debug`. In production mode, they can be found in `production`.

## License
Basis is licensed under the MIT license. See [LICENSE](LICENSE.md) for more detials.