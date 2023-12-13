import { FilePreviewMother } from '../../../../../../../files/domain/models/FilePreviewMother'
import { FileType } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileType'
import {
  FileSize,
  FileSizeUnit,
  FileType as FileTypeModel
} from '../../../../../../../../../src/files/domain/models/FilePreview'

describe('FileType', () => {
  it('renders the type and size correctly when there are no decimals', () => {
    const file = FilePreviewMother.create({
      type: new FileTypeModel('text/plain'),
      size: new FileSize(123.03932894722, FileSizeUnit.BYTES)
    })
    cy.customMount(<FileType type={file.type} size={file.size} />)

    cy.findByText(`Plain Text - 123 B`).should('exist')
  })

  it('renders the type and size correctly when there are decimals', () => {
    const file = FilePreviewMother.create({
      type: new FileTypeModel('text/plain'),
      size: new FileSize(123.932894722, FileSizeUnit.MEGABYTES)
    })
    cy.customMount(<FileType type={file.type} size={file.size} />)

    cy.findByText(`Plain Text - 123.9 MB`).should('exist')
  })

  it('renders the type correctly when is a tabular file', () => {
    const file = FilePreviewMother.createTabular({
      size: new FileSize(123.03932894722, FileSizeUnit.BYTES)
    })

    cy.customMount(<FileType type={file.type} size={file.size} />)

    cy.findByText(`Tabular Data - 123 B`).should('exist')
  })
})
