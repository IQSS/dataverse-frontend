# Changelog

All notable changes to **Dataverse Frontend** are documented here. We also maintain a separate [Design System Changelog](./packages/design-system/CHANGELOG.md) for component-specific changes.

This changelog follows the principles of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/). This document is intended for developers, contributors, and users who need to understand the technical details.

## [Unreleased]

### Added

- Added the value entered by the user in the error messages for metadata field validation errors in EMAIL and URL type fields. For example, instead of showing “Point of Contact E-mail is not a valid email address.“, we now show “Point of Contact E-mail foo is not a valid email address.”
- Contact Owner button in File Page.
- Share button in File Page.
- Link Collection and Link Dataset features.
- Edit Terms Integration.
- With the addition of the new runtime configuration approach, we now support dynamic configuration for languages. If more than one language is configured, the Language Switcher will be shown in the header to allow users to change the language.
- Added Notifications tab in Account Page
- Added runtime configuration options for homepage branding and support link.

### Changed

- Add pagination support to the Dataset Version Summaries and File Version Summaries use cases by introducing optional pagination object. #885
- Refactored pagination to use consistent `CollectionItemsPaginationInfo` object in getMyDataCollectionItems, instead of individual limit/selectedPage parameters.
- Use of the new `sourceLastUpdateTime` query parameter from update dataset and file metadata endpoints to support optimistic concurrency control during editing operations. See [Edit Dataset Metadata](https://guides.dataverse.org/en/6.8/api/native-api.html#edit-dataset-metadata) and [Updating File Metadata](https://guides.dataverse.org/en/6.8/api/native-api.html#updating-file-metadata) guides for more details.
- Changed the way we were handling DATE type metadata field validation to better match the backend validation and give users better error messages. For example, for an input like “foo AD”, we now show “Production Date is not a valid date. The AD year must be numeric.“. For an input like “99999 AD”, we now show “Production Date is not a valid date. The AD year cant be higher than 9999.“. For an input like “[-9999?], we now show “Production Date is not a valid date. The year in brackets cannot be negative.“, etc.
- The SPA now fetches the runtime configuration from `config.js` on each load, allowing configurations without rebuilding the app. We don't use `.env` variables at build time anymore.
- Renamed dataset template fetch/create use cases and DTOs to `getTemplatesByCollectionId` and `CreateTemplateDTO` for API alignment, and added new `getTemplate` and `deleteTemplate` use cases for retrieving a single template by ID and deleting templates.

### Fixed

- Add word-break to items text to prevent layout issues when long descriptions without spaces are entered. (#839)
- Show toast notification when API token is copied to clipboard.
- Dataset versions: (1) file changes should be `Access: Restricted` instead of `isResticted: true/false`; (2) logic of View Detail button. (#879)
- File versions: (1) logic of linking to a file version; (2)If file not included, show text information "File not included in this version.". (#879)

### Removed

---

## [v0.2.0] -- 2025-10-03

### Added

- Dataset Templates integration in the Create Dataset form. (#745)
- Advanced Search UI replicating legacy JSF, with persistence of queries and facet filters. (#760, dataverse#9993)
- External Search integration with selectable search service and first-load fetch behavior. (#710)
- File Edit Tags with populated categories dropdown. (#763)
- DEMO environment option in deploy actions.
- Metadata Export Dropdown to the metadata tab of Dataset Page and File Page.
- External Tools integration. All types supported: Explore, Configure, Preview and Query tools in Dataset and File pages. Still not showing external tools for Auxiliary Files as additional development is needed.
- Dataset page: citation downloads available in multiple formats with copy-to-clipboard. (#786)

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
- Improved URL handling and wrapping across the UI. (#774)

### Documentation

- Introduced CHANGELOG and updated related documents. (#828)
- Added Environments section to README.
- Expanded Keycloak deployment documentation with realm setup and SPI guidance.

### Security

- Fixed dependencies vulnerabilities: reduced npm audit issues from 100+ (including 12 critical and 33 high) to only 2 moderate.

## [v0.1.0] -- 2025-08-13
