# Changelog

All notable changes to **Dataverse Frontend** are documented here. We also maintain a separate [Design System Changelog](./packages/design-system/CHANGELOG.md) for component-specific changes.

This changelog follows the principles of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/). This document is intended for developers, contributors, and users who need to understand the technical details.

## [Unreleased]

### Added

- Dataset Templates integration — Create Dataset form now supports template selection and prefilled fields. (#745)
- DEMO environment option added to deploy actions. (#808)

### Changed

- Dependencies and tooling — major upgrades to reduce vulnerabilities (from 100+ including 12 critical/33 high → only 2 moderate left).
- Keycloak — updated SPI and test realm JSON.
- CHANGELOG introduced & related docs updated. (#828)
- README — new Environments section and clarifications. (#803)

### Fixed

- Files Table — action buttons are always visible. (#800)
- Collection filters — corrected handling of facet values containing `:`. (#812)
- File upload — warning “You can only drop one file to replace” now displays correctly. (#810)
- Collection form — prevent numeric-only aliases. (#798)

---

## [v0.1.0] -- 2025-08-13

[Unreleased]: https://github.com/IQSS/dataverse-frontend/compare/v0.1.0...develop
