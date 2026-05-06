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
    // detect the closest interactive ancestor and bail out.
    cy.get(`[data-testid="files-tree-file-link-${file.path}"]`).click()
    cy.then(() => expect(onToggleSelection).not.to.have.been.called)
  })
})
