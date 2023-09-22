import { IngestInfoMessage } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-info-messages/IngestInfoMessage'
import { FileIngestMother } from '../../../../../../../files/domain/models/FileMother'

describe('IngestInfoMessage', () => {
  it('renders the ingest in progress message', () => {
    cy.customMount(<IngestInfoMessage ingest={FileIngestMother.createInProgress()} />)

    cy.findByText('Ingest in progress...').should('exist')
    cy.findByText('File available in original format only').should('not.exist')
  })

  it('renders the ingest problem when there is an error and the user has update dataset permissions with no report message ', () => {
    cy.customMount(
      <div style={{ height: 300, alignItems: 'center', display: 'flex' }}>
        <IngestInfoMessage ingest={FileIngestMother.createIngestProblem()} />
      </div>
    )

    cy.findByText('Ingest in progress...').should('not.exist')
    cy.findByText('File available in original format only').should('exist')

    cy.findByRole('img', { name: 'tooltip icon' }).should('exist').trigger('mouseover')

    cy.findByRole('link', { name: 'Tabular ingest' }).should('exist')
    cy.findByText(/was unsuccessful. Ingest failed. No further information is available./).should(
      'exist'
    )
  })

  it('renders the ingest problem when there is an error and the user has update dataset permissions with a report message', () => {
    cy.customMount(
      <div style={{ height: 300, alignItems: 'center', display: 'flex' }}>
        <IngestInfoMessage ingest={FileIngestMother.createIngestProblem('Some message.')} />
      </div>
    )

    cy.findByText('Ingest in progress...').should('not.exist')
    cy.findByText('File available in original format only').should('exist')

    cy.findByRole('img', { name: 'tooltip icon' }).should('exist').trigger('mouseover')

    cy.findByRole('link', { name: 'Tabular ingest' }).should('exist')
    cy.findByText(/was unsuccessful. Some message./).should('exist')
  })
})
