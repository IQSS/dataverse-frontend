import { FileMetadata } from '../../../../../src/sections/file/file-metadata/FileMetadata'
import { FileMother } from '../../../files/domain/models/FileMother'
import { FileLabelType } from '../../../../../src/files/domain/models/FilePreview'

describe('FileMetadata', () => {
  it('renders the File Metadata tab', () => {
    cy.customMount(<FileMetadata file={FileMother.create()} />)

    cy.findByRole('button', { name: 'File Metadata' }).should('exist')
  })

  it('renders the file preview', () => {
    cy.customMount(<FileMetadata file={FileMother.create()} />)

    cy.findByText('Preview').should('exist')
    cy.findByRole('img').should('exist')
  })

  it('renders the file labels', () => {
    const labels = [
      { value: 'Category 1', type: FileLabelType.CATEGORY },
      { value: 'Tag 1', type: FileLabelType.TAG },
      { value: 'Tag 2', type: FileLabelType.TAG }
    ]
    cy.customMount(<FileMetadata file={FileMother.create({ labels: labels })} />)

    cy.findByText('File Tags').should('exist')
    cy.findByText('Category 1').should('have.class', 'bg-secondary')
    cy.findAllByText(/Tag/).should('have.class', 'bg-info')
  })

  it('does not render the file labels when there are no labels', () => {
    cy.customMount(<FileMetadata file={FileMother.create({ labels: [] })} />)

    cy.findByText('File Tags').should('not.exist')
  })

  it('renders the file persistent id', () => {
    cy.customMount(
      <FileMetadata file={FileMother.create({ persistentId: 'doi:10.5072/FK2/ABC123' })} />
    )

    cy.findByText('File Persistent ID').should('exist')
    cy.findByText('doi:10.5072/FK2/ABC123').should('exist')
  })
})
