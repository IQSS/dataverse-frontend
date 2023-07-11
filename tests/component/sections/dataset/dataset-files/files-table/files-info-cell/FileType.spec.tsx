import { FileMother } from '../../../../../files/domain/models/FileMother'
import { FileType } from '../../../../../../../src/sections/dataset/dataset-files/files-table/file-info-cell/FileType'

describe('FileType', () => {
  it('renders the type and size correctly', () => {
    const file = FileMother.create()
    cy.customMount(<FileType type={file.type} size={file.size} />)

    cy.findByText(`${file.type.toDisplayFormat()} - ${file.size.toString()}`).should('exist')
  })
})
