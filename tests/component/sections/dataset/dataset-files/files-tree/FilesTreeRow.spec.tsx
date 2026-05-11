import { FilesTreeRow } from '../../../../../../src/sections/dataset/dataset-files/files-tree/FilesTreeRow'
import { DatasetVersionNumber } from '../../../../../../src/dataset/domain/models/Dataset'
import {
  FileTreeFileMother,
  FileTreeFolderMother
} from '../../../../files/domain/models/FileTreeItemMother'

const versionNumber = new DatasetVersionNumber(1, 0)

describe('FilesTreeRow', () => {
  beforeEach(() => {
    // Cypress's default component viewport is 500×500. The row's grid
    // columns (select / name / size / access / files / actions) all
    // claim fixed widths except `name`, which is 1fr; at 500 px the
    // `name` column shrinks small enough that the file-link anchor
    // visually overlaps the size cell, and Cypress's hit-testing then
    // refuses to click the link ("element is being covered"). At
    // realistic viewport widths the layout is fine. Force a 1024 px
    // viewport so the tests reflect actual layout behaviour rather
    // than an iframe-sizing artefact.
    cy.viewport(1024, 720)
  })

  it('uses a plain anchor when buildFileMetadataUrl is provided', () => {
    const file = FileTreeFileMother.create({
      id: 99,
      name: 'sample.txt',
      path: 'sample.txt',
      size: 100
    })
    cy.customMount(
      <FilesTreeRow
        depth={0}
        top={0}
        height={32}
        item={file}
        selectionState="none"
        onToggleSelection={() => undefined}
        onDownload={() => undefined}
        datasetVersionNumber={versionNumber}
        buildFileMetadataUrl={(f) => `https://standalone.example/file/${f.id}`}
      />
    )
    cy.get(`[data-testid="files-tree-file-link-${file.path}"]`).should(
      'have.attr',
      'href',
      'https://standalone.example/file/99'
    )
  })

  it('renders the checkbox in a dedicated select column outside the name column', () => {
    // The selection checkbox lives in its own grid column, not inside
    // the name column. This makes "you can select rows" obvious at a
    // glance and lets the row-click handler still toggle when the user
    // misses the checkbox target.
    const file = FileTreeFileMother.create({
      id: 12,
      name: 'select.txt',
      path: 'select.txt'
    })
    cy.customMount(
      <FilesTreeRow
        depth={0}
        top={0}
        height={32}
        item={file}
        selectionState="none"
        onToggleSelection={() => undefined}
        onDownload={() => undefined}
        datasetVersionNumber={versionNumber}
      />
    )
    cy.get(`[data-testid="files-tree-checkbox-${file.path}"]`).then(($cb) => {
      const checkbox = $cb[0]
      // The checkbox's parent has the row-select class — the dedicated
      // selection column. Crucially, that parent must not be the row-name
      // wrapper.
      expect(checkbox.parentElement?.className).to.match(/row-select/)
      expect(checkbox.parentElement?.className).to.not.match(/row-name/)
    })
  })

  it('reflects selectionState through aria-checked on the checkbox', () => {
    const file = FileTreeFileMother.create({
      id: 13,
      name: 'aria.txt',
      path: 'aria.txt'
    })
    cy.customMount(
      <FilesTreeRow
        depth={0}
        top={0}
        height={32}
        item={file}
        selectionState="all"
        onToggleSelection={() => undefined}
        onDownload={() => undefined}
        datasetVersionNumber={versionNumber}
      />
    )
    cy.get(`[data-testid="files-tree-checkbox-${file.path}"]`).should(
      'have.attr',
      'aria-checked',
      'true'
    )
  })

  it('does not toggle selection when the click target is an inner anchor', () => {
    const file = FileTreeFileMother.create({
      id: 7,
      name: 'inner.txt',
      path: 'inner.txt',
      size: 50
    })
    const onToggleSelection = cy.stub()
    cy.customMount(
      <FilesTreeRow
        depth={0}
        top={0}
        height={32}
        item={file}
        selectionState="none"
        onToggleSelection={onToggleSelection}
        onDownload={() => undefined}
        datasetVersionNumber={versionNumber}
        buildFileMetadataUrl={(f) => `https://standalone.example/file/${f.id}`}
      />
    )
    // Click the file-name anchor; the row's bubbled click handler should
    // detect the closest interactive ancestor and bail out. Use
    // `.trigger('click')` rather than `.click()` so Cypress does not also
    // follow the anchor's href and navigate the component-test iframe
    // (which would hang the runner).
    cy.get(`[data-testid="files-tree-file-link-${file.path}"]`).trigger('click')
    cy.then(() => expect(onToggleSelection).not.to.have.been.called)
  })

  // ---- Access cell --------------------------------------------------
  // The tree row exposes the per-file / per-folder access status in a
  // dedicated column so users can see at a glance which subtree contains
  // restricted or embargoed files. Files render the capitalised status
  // word; folders render counts of restricted/embargoed in the subtree
  // (silent when everything is public — public is the default and would
  // be column-noise).

  it('renders "Public" for a public file row', () => {
    const file = FileTreeFileMother.create({
      id: 100,
      name: 'open.txt',
      path: 'open.txt',
      size: 10,
      accessStatus: 'public'
    })
    cy.customMount(
      <FilesTreeRow
        depth={0}
        top={0}
        height={32}
        item={file}
        selectionState="none"
        onToggleSelection={() => undefined}
        onDownload={() => undefined}
        datasetVersionNumber={versionNumber}
      />
    )
    cy.findByTestId(`files-tree-row-access-${file.path}`).should('have.text', 'Public')
  })

  it('renders "Restricted" for a restricted file row, with the warn-emphasis class', () => {
    const file = FileTreeFileMother.create({
      id: 101,
      name: 'locked.txt',
      path: 'locked.txt',
      size: 10,
      accessStatus: 'restricted'
    })
    cy.customMount(
      <FilesTreeRow
        depth={0}
        top={0}
        height={32}
        item={file}
        selectionState="none"
        onToggleSelection={() => undefined}
        onDownload={() => undefined}
        datasetVersionNumber={versionNumber}
      />
    )
    cy.findByTestId(`files-tree-row-access-${file.path}`)
      .should('have.text', 'Restricted')
      .invoke('attr', 'class')
      .should('contain', 'row-access-restricted')
  })

  it('renders "Embargoed" for an embargoed file row, with the info-emphasis class', () => {
    const file = FileTreeFileMother.create({
      id: 102,
      name: 'pending.txt',
      path: 'pending.txt',
      size: 10,
      accessStatus: 'embargoed'
    })
    cy.customMount(
      <FilesTreeRow
        depth={0}
        top={0}
        height={32}
        item={file}
        selectionState="none"
        onToggleSelection={() => undefined}
        onDownload={() => undefined}
        datasetVersionNumber={versionNumber}
      />
    )
    cy.findByTestId(`files-tree-row-access-${file.path}`)
      .should('have.text', 'Embargoed')
      .invoke('attr', 'class')
      .should('contain', 'row-access-embargoed')
  })

  it('leaves the access cell empty for a file with no accessStatus (older server)', () => {
    const file = FileTreeFileMother.create({
      id: 103,
      name: 'unknown.txt',
      path: 'unknown.txt',
      size: 10
    })
    cy.customMount(
      <FilesTreeRow
        depth={0}
        top={0}
        height={32}
        item={file}
        selectionState="none"
        onToggleSelection={() => undefined}
        onDownload={() => undefined}
        datasetVersionNumber={versionNumber}
      />
    )
    cy.findByTestId(`files-tree-row-access-${file.path}`).should('have.text', '')
  })

  it('renders the recursive byte total in the size column for a folder row', () => {
    const folder = FileTreeFolderMother.create({
      name: 'data',
      path: 'data',
      counts: { files: 3, folders: 1, bytes: 4096 }
    })
    cy.customMount(
      <FilesTreeRow
        depth={0}
        top={0}
        height={32}
        item={folder}
        selectionState="none"
        onToggleSelection={() => undefined}
        onDownload={() => undefined}
        datasetVersionNumber={versionNumber}
      />
    )
    cy.findByTestId(`files-tree-row-${folder.path}`).should('contain.text', '4.0 KB')
  })

  it('renders the restricted count for a folder whose subtree contains restricted files', () => {
    const folder = FileTreeFolderMother.create({
      name: 'data',
      path: 'data',
      counts: { files: 5, folders: 0, bytes: 0, restricted: 3, embargoed: 0 }
    })
    cy.customMount(
      <FilesTreeRow
        depth={0}
        top={0}
        height={32}
        item={folder}
        selectionState="none"
        onToggleSelection={() => undefined}
        onDownload={() => undefined}
        datasetVersionNumber={versionNumber}
      />
    )
    cy.findByTestId(`files-tree-row-access-${folder.path}`)
      .should('have.text', '3 restricted')
      .invoke('attr', 'class')
      .should('contain', 'row-access-restricted')
  })

  it('renders the embargoed count when the subtree has only embargoed files', () => {
    const folder = FileTreeFolderMother.create({
      name: 'data',
      path: 'data',
      counts: { files: 2, folders: 0, bytes: 0, restricted: 0, embargoed: 1 }
    })
    cy.customMount(
      <FilesTreeRow
        depth={0}
        top={0}
        height={32}
        item={folder}
        selectionState="none"
        onToggleSelection={() => undefined}
        onDownload={() => undefined}
        datasetVersionNumber={versionNumber}
      />
    )
    cy.findByTestId(`files-tree-row-access-${folder.path}`)
      .should('have.text', '1 embargoed')
      .invoke('attr', 'class')
      .should('contain', 'row-access-embargoed')
  })

  it('combines counts when the subtree mixes restricted and embargoed files', () => {
    const folder = FileTreeFolderMother.create({
      name: 'data',
      path: 'data',
      counts: { files: 6, folders: 0, bytes: 0, restricted: 3, embargoed: 1 }
    })
    cy.customMount(
      <FilesTreeRow
        depth={0}
        top={0}
        height={32}
        item={folder}
        selectionState="none"
        onToggleSelection={() => undefined}
        onDownload={() => undefined}
        datasetVersionNumber={versionNumber}
      />
    )
    // Restricted takes precedence on the colour cue when both are
    // present — same precedence as the per-file `access` resolution.
    cy.findByTestId(`files-tree-row-access-${folder.path}`)
      .should('have.text', '3 restricted · 1 embargoed')
      .invoke('attr', 'class')
      .should('contain', 'row-access-restricted')
  })

  it('leaves the access cell empty for an all-public folder', () => {
    // Public is the default; rendering it in every all-public folder
    // would be noise. The cell stays empty so non-empty values stand out.
    const folder = FileTreeFolderMother.create({
      name: 'data',
      path: 'data',
      counts: { files: 5, folders: 0, bytes: 1024 }
    })
    cy.customMount(
      <FilesTreeRow
        depth={0}
        top={0}
        height={32}
        item={folder}
        selectionState="none"
        onToggleSelection={() => undefined}
        onDownload={() => undefined}
        datasetVersionNumber={versionNumber}
      />
    )
    cy.findByTestId(`files-tree-row-access-${folder.path}`).should('have.text', '')
  })
})
