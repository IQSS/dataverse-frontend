import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FormattedFileCitation } from '@/files/domain/models/FileCitation'
import { FileCitationDownloadButton } from '@/sections/shared/citation/citation-download/FileCitationDownloadButton'

const fileRepository: FileRepository = {} as FileRepository
const mockCitation: FormattedFileCitation = {
  content: 'Mock File Citation',
  contentType: 'text/plain'
}

describe('FileCitationDownloadButton', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      cy.stub(win.URL, 'createObjectURL').returns('mock-url')
      cy.stub(win.URL, 'revokeObjectURL')
    })
  })

  it('renders the Cite Data File button', () => {
    cy.customMount(<FileCitationDownloadButton fileRepository={fileRepository} fileId={3} />)
    cy.findByRole('button', { name: 'Cite Data File' }).should('exist')
  })

  it('opens the dropdown list and displays citation download options', () => {
    fileRepository.getFileCitationByFormat = cy.stub().resolves(mockCitation)

    cy.customMount(<FileCitationDownloadButton fileRepository={fileRepository} fileId={3} />)

    cy.findByRole('button', { name: 'Cite Data File' }).click()
    cy.findByText('Download EndNote XML').should('exist')
    cy.findByText('Download RIS').should('exist')
    cy.findByText('Download BibTeX').should('exist')
    cy.findByText('View Styled Citation').should('not.exist')
  })

  it('downloads BibTeX file citation and shows success toast', () => {
    fileRepository.getFileCitationByFormat = cy.stub().resolves(mockCitation)

    cy.customMount(<FileCitationDownloadButton fileRepository={fileRepository} fileId={3} />)

    cy.findByRole('button', { name: 'Cite Data File' }).click()
    cy.findByText('Download BibTeX').click()

    cy.then(() => {
      expect(fileRepository.getFileCitationByFormat).to.have.been.calledWith(3, 'BibTeX')
    })
    cy.window().then((win) => {
      expect(win.URL['createObjectURL']).to.have.been.called
      expect(win.URL['revokeObjectURL']).to.have.been.called
    })
    cy.findByText('Citation downloaded successfully').should('exist')
  })

  it('handles errors when downloading file citation', () => {
    fileRepository.getFileCitationByFormat = cy.stub().rejects(new Error('Download error'))

    cy.customMount(<FileCitationDownloadButton fileRepository={fileRepository} fileId={3} />)

    cy.findByRole('button', { name: 'Cite Data File' }).click()
    cy.findByText('Download EndNote XML').click()
    cy.findByText('An error occurred while downloading the citation').should('exist')
  })
})
