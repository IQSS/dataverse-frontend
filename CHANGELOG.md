# Changelog

All notable changes to **Dataverse Frontend** are documented here. We also maintain a separate [Design System Changelog](./packages/design-system/CHANGELOG.md) for component-specific changes.

This changelog follows the principles of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/). This document is intended for developers, contributors, and users who need to understand the technical details.

## [Unreleased]

### Added

- Dataset Templates Selector in the Create Dataset page.
- Metadata Export Dropdown to the metadata tab of Dataset Page and File Page.
- External Tools integration. All types supported: Explore, Configure, Preview and Query tools in Dataset and File pages. Still not showing external tools for Auxiliary Files as additional development is needed.

### Changed

- Standardize Node.js version to 22 across all environments (docker dev environment, CI, production).

### Fixed

- Upgrade dependencies to drastically reduce vulnerabilities flagged by `npm audit`. Reduced from +100 including 12 critical and 33 high to only 2 moderate.
- Add word-break to the the items to fix UI wrappers break when entering long descriptions without spacing. (#839)

### Removed

---

## [v0.1.0] -- 2025-08-13

[Unreleased]: https://github.com/IQSS/dataverse-frontend/compare/v0.1.0...develop
