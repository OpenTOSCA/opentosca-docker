# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [0.0.2] - 2017-05-08
### Added
- Building `opentosca-ui` container with new Angular-based OpenTOSCA UI.
- Building container for BMPN4TOSCA Modeler (`winery-bpmn4tosca').
- Docker Compose: Added Docker-in-Docker container (`jpetazzo/dind`) to run Docker-based topologies with OpenTOSCA.
### Changed
- Build Tomcat container from official image.
- Build BPS container from official OpenJDK image.
- Build `opentosca-container` container from official Maven image.
- Build Winery container from official Maven image.
- Docker Compose: Variable `GIT_BRANCH` can be used to build containers from a specific Git branch.
### Removed
- Removed Vinothek container since it will be replaced with the new OpenTOSCA UI (`opentosca-ui`).
- Removed `ROOT.war`; it will be replaced with a new landing page in future.

## 0.0.1 - 2016-08-25
Initial submission by @jojow: https://github.com/jojow/opentosca-dockerfiles

[Unreleased]: https://github.com/OpenTOSCA/opentosca-dockerfiles/compare/v0.0.2...HEAD
[0.0.2]: https://github.com/jojow/opentosca-dockerfiles/compare/master...OpenTOSCA:v0.0.2
