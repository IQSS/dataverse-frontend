import { FilePreviewMother } from '../../../../../../../files/domain/models/FilePreviewMother'
import { FileTitle } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileTitle'

describe('FileTitle', () => {
  it('renders the link and name correctly', () => {
    const id = 12345
    const name = 'file-name.txt'
    const file = FilePreviewMother.create({
      id: id,
      name: name
    })

    cy.customMount(<FileTitle id={file.id} name={file.name} />)

    cy.findByRole('link', { name: name }).should('have.attr', 'href', `/files?id=${id}`)
  })
})
