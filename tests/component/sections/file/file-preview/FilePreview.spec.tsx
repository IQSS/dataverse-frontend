import { FilePreview } from '../../../../../src/sections/file/file-preview/FilePreview'
import { FileMother } from '../../../files/domain/models/FileMother'
import { FileType } from '../../../../../src/files/domain/models/FilePreview'

describe('FilePreview', () => {
  it('renders the file image', () => {
    const file = FileMother.createWithThumbnail()
    cy.customMount(<FilePreview thumbnail={file.thumbnail} type={file.type} name={file.name} />)

    cy.findByAltText(file.name).should('exist').should('have.attr', 'src', file.thumbnail)
  })

  it('renders the file icon', () => {
    const file = FileMother.createWithoutThumbnail({ type: new FileType('text/plain') })
    cy.customMount(<FilePreview thumbnail={file.thumbnail} type={file.type} name={file.name} />)

    cy.findByLabelText('icon-document').should('exist')
  })
})
