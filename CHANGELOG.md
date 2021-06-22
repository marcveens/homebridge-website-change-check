# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).



## [1.0.8] - 2021-06-22
### Added
- Added `ignoreValues` config for ignoring certain check values. For example, if "test123" is the result of a changeCheck, and "test123" is added to the `ignoreValues` list, it won't cause a motion trigger.

## [1.0.6] - 2021-03-13
### Added
- Added `click` as a `stepsBeforeCheck` action
- Added travis.yml for CI
### Changed
- Migrated from `puppeteer` to `playwright` due to less code writing and seemingly better stability. 
- Abstracted some plugin code from Homebridge to make it better testable.   
- Improved the config.schema.json to make a more intuitive settings UI.

## [1.0.5] - 2021-03-13
### Added
- `stepsBeforeCheck` option for every changeCheck. See README.md for how to use it.
### Changed
- Prevent motion detection when a timeout occurs

## [1.0.4] - 2021-03-11
### Added
- Showing extra message when Chromium is not installed

### Changed
- Updated name to include "Homebridge" in UI

## [1.0.3] - 2021-02-24
### Changed
- Made sure plugin doesn't crash without configuration

## [1.0.2] - 2021-02-21
### Added
- Tests for more reliability

### Changed
- Changed `OccupancySensor` to `MotionSensor` for better compatibility with HomeKit.

## [1.0.1] - 2021-02-20
### Added
- Webpage change checker using Puppeteer
