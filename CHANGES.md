# guh Changes

## 2.0.1
- Updated typings to match Typings 1.0

## 2.0.0
- Renamed from Basis to guh
- Rewrite from the ground-up
	- Moved build system core to `guh-core` package
	- Switched from LiveReload to BrowserSync
	- Switched from Ruby Sass to libsass
- Now requires Node ^5.0
- More flexible configuration format
	- Local configuration support
- Added CLI
	- `guh new` to generate
	- `guh build` to build

## 1.2.1
- Fixed version number in `package.json`
- Fixed server script build references

## 1.2.0
- Added extra optional arguments to `gulp build` to build only specific modules

## 1.1.1
- Updated dependencies

## 1.1.0
- Cleaned up typings folder
- Updated dependencies

## 1.0.1
- Fix TS glob pattern in default config

## 1.0.0
- Initial release