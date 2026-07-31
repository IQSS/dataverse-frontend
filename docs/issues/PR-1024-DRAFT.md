# PR draft for #1024 — DO NOT PUBLISH until user approves

**Status:** Prepared only. Do **not** run `gh pr create` until explicit approval.

## Command to publish later (only when approved)

```bash
cd /Users/shihuayu/Documents/GitHub/dataverse-frontend
gh pr create --repo IQSS/dataverse-frontend \
  --base develop \
  --head youseihuayu-wonderful:fix/1024-edit-metadata-latest-version \
  --title "Fix Edit Metadata to always pre-populate latest metadata" \
  --body-file docs/issues/PR-1024-DRAFT-BODY.md
```

## Title

```
Fix Edit Metadata to always pre-populate latest metadata
```

## Base / head

|             |                                                               |
| ----------- | ------------------------------------------------------------- |
| Base repo   | `IQSS/dataverse-frontend`                                     |
| Base branch | `develop`                                                     |
| Head        | `youseihuayu-wonderful:fix/1024-edit-metadata-latest-version` |
| Fixes       | https://github.com/IQSS/dataverse-frontend/issues/1024        |

## Commits included

1. `f10860954` — Fix Edit Metadata to always load latest dataset version
2. `0b573ad3f` — Add HTML verification report for Edit Metadata latest-version fix

## Files

- `src/sections/edit-dataset-metadata/EditDatasetMetadataFactory.tsx` — production fix
- `tests/component/sections/edit-dataset-metadata/EditDatasetMetadataFactory.spec.tsx` — regression
- `docs/issues/1024-edit-metadata-latest-version.md` — playbook (optional for upstream; can drop if reviewers prefer)
- `docs/issues/1024-edit-metadata-latest-version-verification.html` — before/after report (optional)

## Local verification already done

```
EditDatasetMetadataFactory
  ✓ always fetches :latest when the URL carries an older published version (issue #1024)
  ✓ still fetches :latest when the URL has no version param

2 passing
All specs passed!
```

Node: v22.23.2 · Cypress: 15.2.0
