# Changelog

All notable changes to **Dataverse Frontend** are documented here. We also maintain a separate [Design System Changelog](./packages/design-system/CHANGELOG.md) for component-specific changes.

This changelog follows the principles of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/). This document is intended for developers, contributors, and users who need to understand the technical details.

## [Unreleased]

### Added

- Dataset Templates Selector in the Create Dataset page.
- Metadata Export Dropdown to the metadata tab of Dataset Page and File Page.
- External Tools integration. All types supported: Explore, Configure, Preview and Query tools in Dataset and File pages. Still not showing external tools for Auxiliary Files as additional development is needed.
- Added the value entered by the user in the error messages for metadata field validation errors in EMAIL and URL type fields. For example, instead of showing "Point of Contact E-mail is not a valid email address.", we now show "Point of Contact E-mail foo is not a valid email address."

### Changed

- Standardize Node.js version to 22 across all environments (docker dev environment, CI, production).
- Changed the way we were handling DATE type metadata field validation to better match the backend validation and give users better error messages. For example, for an input like "foo AD", we now show "Production Date is not a valid date. The AD year must be numeric.". For an input like "99999 AD", we now show "Production Date is not a valid date. The AD year cant be higher than 9999.". For an input like "[-9999?], we now show "Production Date is not a valid date. The year in brackets cannot be negative.", etc.

### Fixed

- Upgrade dependencies to drastically reduce vulnerabilities flagged by `npm audit`. Reduced from +100 including 12 critical and 33 high to only 2 moderate.

### Removed

---

## [v0.1.0] -- 2025-08-13

[Unreleased]: https://github.com/IQSS/dataverse-frontend/compare/v0.1.0...develop
