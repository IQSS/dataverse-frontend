# Changelog

All notable changes to **Dataverse Frontend** are documented here. We also maintain a separate [Design System Changelog](./packages/design-system/CHANGELOG.md) for component-specific changes.

This changelog follows the principles of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/). This document is intended for developers, contributors, and users who need to understand the technical details.

## [Unreleased]

### Added

- Dataset Templates integration in the Create Dataset form. (#745)
- Advanced Search UI replicating legacy JSF, with persistence of queries and facet filters. (#760, dataverse#9993)
- External Search integration with selectable search service and first-load fetch behavior. (#710)
- File Edit Tags with populated categories dropdown. (#763)
- DEMO environment option in deploy actions.

### Changed

- Standardized Node.js to v22 across environments (docker dev, CI, production).
- Upgrade Keycloak to 26.3.2; updated SPI and test realm JSON.
- Truncate long collection and dataset descriptions with expandable content. (#789)
- UI polish: Files Table always shows action buttons. (#800)

### Fixed

- Guest user access: file info retrieval works on deaccessioned datasets. (#752)
- Collection filter queries with values containing ":" now parsed correctly. (#812)
- File upload: corrected "drop one file to replace" warning behavior. (#810)
- Create Collection form: prevent numeric-only aliases. (#798)
- Dataset page: citation downloads available in multiple formats with copy-to-clipboard. (#786)
- Improved URL handling and wrapping across the UI. (#774)

### Documentation

- Introduced CHANGELOG and updated related documents. (#828)
- Added Environments section to README.
- Expanded Keycloak deployment documentation with realm setup and SPI guidance.

### Security

- Fixed dependencies vulnerabilities: reduced npm audit issues from 100+ (including 12 critical and 33 high) to only 2 moderate.

---

## [v0.1.0] -- 2025-08-13

[Unreleased]: https://github.com/IQSS/dataverse-frontend/compare/v0.1.0...develop
