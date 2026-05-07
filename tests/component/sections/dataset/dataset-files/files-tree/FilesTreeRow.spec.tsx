import { FilesTreeRow } from '../../../../../../src/sections/dataset/dataset-files/files-tree/FilesTreeRow'
import { DatasetVersionNumber } from '../../../../../../src/dataset/domain/models/Dataset'
import { FileTreeFileMother } from '../../../../files/domain/models/FileTreeItemMother'

const versionNumber = new DatasetVersionNumber(1, 0)

describe('FilesTreeRow', () => {
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
})
