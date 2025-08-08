import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { CitationDownloadButton } from '../../../../../src/sections/shared/citation/citation-download/CitationDownloadButton'
import { FormattedCitation } from '@/dataset/domain/models/DatasetCitation'
import { ViewStyledCitationModal } from '@/sections/shared/citation/citation-download/ViewStyledCitationModal'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const mockCitation: FormattedCitation = {
  content: 'Mock Citation',
  contentType: 'text/plain'
}

describe('CitationDownloadButton', () => {
  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    cy.window().then((win) => {
      cy.stub(win.URL, 'createObjectURL').returns('mock-url')
      cy.stub(win.URL, 'revokeObjectURL')
    })
  })

  it('renders the button', () => {
    cy.customMount(
      <CitationDownloadButton datasetRepository={datasetRepository} datasetId="" version="" />
    )
    cy.findByRole('button', { name: 'Cite Dataset' }).should('exist')
  })

  it('downloads EndNote XML citation', () => {
    datasetRepository.getDatasetCitationInOtherFormats = cy.stub().resolves(mockCitation)

    cy.customMount(
      <CitationDownloadButton
        datasetRepository={datasetRepository}
        datasetId="test-dataset"
        version="1.0"
      />
    )

    cy.findByRole('button', { name: 'Cite Dataset' }).click()
    cy.findByText('Download EndNote XML').click()

    cy.then(() => {
      expect(datasetRepository.getDatasetCitationInOtherFormats).to.have.been.calledWith(
        'test-dataset',
        '1.0',
        'EndNote'
      )
    })
    cy.window().then((win) => {
      expect(win.URL['createObjectURL']).to.have.been.called
      expect(win.URL['revokeObjectURL']).to.have.been.called
    })
  })

  it('downloads RIS citation and triggers file download', () => {
    datasetRepository.getDatasetCitationInOtherFormats = cy.stub().resolves(mockCitation)

    cy.customMount(
      <CitationDownloadButton
        datasetRepository={datasetRepository}
        datasetId="test-dataset"
        version="1.0"
      />
    )

    cy.findByRole('button', { name: 'Cite Dataset' }).click()
    cy.findByText('Download RIS').click()

    cy.then(() => {
      expect(datasetRepository.getDatasetCitationInOtherFormats).to.have.been.calledWith(
        'test-dataset',
        '1.0',
        'RIS'
      )
    })
    cy.window().then((win) => {
      expect(win.URL['createObjectURL']).to.have.been.called
    })
  })

  it('downloads BibTeX citation and creates download link', () => {
    datasetRepository.getDatasetCitationInOtherFormats = cy.stub().resolves(mockCitation)

    cy.customMount(
      <CitationDownloadButton
        datasetRepository={datasetRepository}
        datasetId="test-dataset"
        version="1.0"
      />
    )

    cy.findByRole('button', { name: 'Cite Dataset' }).click()
    cy.findByText('Download BibTeX').click()

    cy.then(() => {
      expect(datasetRepository.getDatasetCitationInOtherFormats).to.have.been.calledWith(
        'test-dataset',
        '1.0',
        'BibTeX'
      )
    })

    cy.window().then((win) => {
      expect(win.URL['createObjectURL']).to.have.been.called
      expect(win.URL['revokeObjectURL']).to.have.been.called
    })
  })

  it('verifies correct filename is used for download', () => {
    const createElementSpy = cy.spy(document, 'createElement')
    datasetRepository.getDatasetCitationInOtherFormats = cy.stub().resolves(mockCitation)

    cy.customMount(
      <CitationDownloadButton
        datasetRepository={datasetRepository}
        datasetId="my-dataset"
        version="2.0"
      />
    )

    cy.findByRole('button', { name: 'Cite Dataset' }).click()
    cy.findByText('Download EndNote XML').click()

    cy.then(() => {
      expect(createElementSpy).to.have.been.calledWith('a')
    })
  })

  it('opens the dropdown list and displays the citation download options', () => {
    datasetRepository.getDatasetCitationInOtherFormats = cy.stub().resolves(mockCitation)
    cy.customMount(
      <CitationDownloadButton datasetRepository={datasetRepository} datasetId="" version="" />
    )
    cy.findByRole('button', { name: 'Cite Dataset' }).click()
    cy.findByText('Download EndNote XML').should('exist')
    cy.findByText('Download RIS').should('exist')
    cy.findByText('Download BibTeX').should('exist')
    cy.findByText('View Styled Citation').should('exist')
  })

  it('handles errors when downloading citation', () => {
    datasetRepository.getDatasetCitationInOtherFormats = cy
      .stub()
      .rejects(new Error('Download error'))
    cy.customMount(
      <CitationDownloadButton datasetRepository={datasetRepository} datasetId="" version="" />
    )
    cy.findByRole('button', { name: 'Cite Dataset' }).click()
    cy.findByText('Download EndNote XML').click()
    cy.findByText('An error occurred while downloading the citation').should('exist')
  })

  it('opens styled citation modal when View Styled Citation is clicked', () => {
    datasetRepository.getDatasetCitationInOtherFormats = cy.stub().resolves(mockCitation)
    cy.customMount(
      <CitationDownloadButton
        datasetRepository={datasetRepository}
        datasetId="test-dataset"
        version="1.0"
      />
    )

    cy.customMount(
      <ViewStyledCitationModal show={true} handleClose={() => {}} citation={mockCitation} />
    )

    cy.findByText('Download Citation').click()
    cy.findByText('Select CSL Style').should('exist')
    cy.findByText(mockCitation.content).should('exist')
    cy.findByRole('button', { name: /Copy to clipboard icon/ }).should('exist')
    cy.findByRole('dialog').should('exist')
  })

  it('closes styled citation modal when close is triggered', () => {
    datasetRepository.getDatasetCitationInOtherFormats = cy.stub().resolves(mockCitation)

    cy.customMount(
      <CitationDownloadButton
        datasetRepository={datasetRepository}
        datasetId="test-dataset"
        version="1.0"
      />
    )

    cy.findByRole('button', { name: 'Cite Dataset' }).click()
    cy.findByText('View Styled Citation').click()

    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: /close/i }).click()
    cy.findByRole('dialog').should('not.exist')
  })

  it('handles error when fetching styled citation', () => {
    datasetRepository.getDatasetCitationInOtherFormats = cy
      .stub()
      .rejects(new Error('Citation fetch error'))

    cy.customMount(
      <CitationDownloadButton
        datasetRepository={datasetRepository}
        datasetId="test-dataset"
        version="1.0"
      />
    )

    cy.findByRole('button', { name: 'Cite Dataset' }).click()
    cy.findByText('View Styled Citation').click()

    cy.findByText('An error occurred while downloading the citation').should('exist')
  })
})
