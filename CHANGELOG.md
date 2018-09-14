# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Added

- Added proxy to reach frontends using `<hostname>:80/(ui|winery|ode|manager)`

## [2.1.0] (silvaner)

Initial submission by @jojow: https://github.com/jojow/opentosca-dockerfiles

### Added

- Added override configuration to use WSO2 BPS.
- Added production-ready configuration for Linux-based operating systems.
- Added basic override configuration. Can be used with `cp _docker-compose.override.yml docker-compose.override.yml`.
- Added a Changelog file based on the format of [Keep a Changelog](http://keepachangelog.com/).
- Added build arg `GIT_REPO_URL` to configure the used Git repository.
- The containers (`winery`, `web`) are now able to be run individually, without the requirement to have a linked Tomcat image in place.
- Eclipse Winery™ is used as Container Repository as well as Modelling Tool in separate containers.
- Docker Compose configuration uses a `bridge` network in order to use service names as FQDNs.
- Building `opentosca-ui` container with new Angular-based OpenTOSCA UI.
- Building container for BMPN4TOSCA Modeler (`winery-bpmn4tosca').
- Docker Compose: Added Docker-in-Docker container (`jpetazzo/dind`) to run Docker-based topologies with OpenTOSCA.

### Changed

- Moved the `Dockerfiles` to dedicated repositories; building and publishing images to Docker Hub is now part of those repositories.
- Changed default plan engine to Apache ODE.
- Build Tomcat container from official image.
- Build BPS container from official OpenJDK image.
- Build `opentosca-container` container from official Maven image.
- Build Winery container from official Maven image.
- Docker Compose: Variable `GIT_BRANCH` can be used to build containers from a specific Git branch.

### Removed

- Removed Vinothek container since it will be replaced with the new OpenTOSCA UI (`opentosca/ui`).
- Removed `ROOT.war`; it will be replaced with a new landing page in future.

[Unreleased]: https://github.com/OpenTOSCA/opentosca-dockerfiles/compare/v2.1.0-silvaner...HEAD
[2.1.0]: https://github.com/jojow/opentosca-dockerfiles/compare/master...OpenTOSCA:v2.1.0-silvaner
