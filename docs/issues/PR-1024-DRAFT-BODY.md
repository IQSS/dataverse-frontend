## Summary

- Fixes #1024: when opening **Edit Metadata** from an older dataset version, the SPA now pre-fills **latest** metadata (`:latest` — draft if present, otherwise latest published), matching JSF and `EditDatasetTermsFactory`.
- Root cause: `EditDatasetMetadataFactory` used the browsed `version` query param (e.g. `1.0`). It now ignores that param and always fetches `DatasetNonNumericVersion.LATEST`.
- Adds component regression tests asserting `getByPersistentId(..., ':latest', ...)` and not `"1.0"`.

## Test plan

- [x] Local: `npx cypress run --component --spec tests/component/sections/edit-dataset-metadata/EditDatasetMetadataFactory.spec.tsx` → **2 passing**
- [ ] CI component tests
- [ ] Manual: publish v1 without subtitle → publish v2 with subtitle → browse `?version=1.0` → Edit Metadata → subtitle shows v2 value
- [ ] Manual: browsing `?version=1.0` without editing still shows historical v1 metadata

## Notes

- Browse-page version selection is unchanged.
- Optional docs under `docs/issues/` are included for review context; happy to drop them from the PR if preferred.
