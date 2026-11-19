import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetCurationStatusHistoryModal } from '@/sections/dataset/dataset-curation-status/DatasetCurationStatusHistoryModal'
import { WithRepositories } from '@tests/component/WithRepositories'

const datasetId = 'doi:10.5072/FK2/ABC123'

const mountModal = (datasetRepository: DatasetRepository, show = true) =>
  cy.customMount(
    <WithRepositories datasetRepository={datasetRepository}>
      <DatasetCurationStatusHistoryModal
        show={show}
        datasetId={datasetId}
        handleClose={cy.stub().as('handleClose')}
      />
    </WithRepositories>
  )

describe('DatasetCurationStatusHistoryModal', () => {
  let datasetRepository: DatasetRepository

  beforeEach(() => {
    datasetRepository = {} as DatasetRepository
  })

  it('renders the history including removals', () => {
    datasetRepository.getCurationStatusHistory = cy.stub().resolves([
      {
        label: 'Final Approval',
        createTime: '2026-11-10T19:12:33.123Z',
        assigner: '@dataverseAdmin',
        assignerDisplayName: 'Dataverse Admin'
      },
      { label: 'Privacy Review', createTime: '2025-01-15 10:30:00.0', assigner: '@curator' },
      { createTime: '2025-01-14 09:00:00.0', assigner: '@curator' },
      { label: 'Author Contacted' }
    ])

    mountModal(datasetRepository)

    cy.findByRole('dialog').should('exist')
    cy.findByText('Curation Status History').should('exist')
    cy.findByRole('columnheader', { name: 'Status' }).should('exist')
    cy.findByRole('columnheader', { name: 'Date' }).should('exist')
    cy.findByRole('columnheader', { name: 'Assigner' }).should('exist')
    cy.findAllByRole('row').should('have.length', 5)
    cy.findByText('2026-11-10 19:12:33').should('exist')
    cy.findByText('Dataverse Admin').should('exist')
    cy.findByText('@dataverseAdmin').should('not.exist')
    cy.findByText('Privacy Review').should('exist')
    cy.findByText('2025-01-15 10:30:00').should('exist')
    cy.findAllByText('@curator').should('have.length', 2)
    cy.findByText('Status removed').should('exist')
    cy.findByText('Author Contacted').should('exist')
    cy.wrap(datasetRepository.getCurationStatusHistory).should('have.been.calledWith', datasetId)
  })

  it('renders an empty message when there is no history', () => {
    datasetRepository.getCurationStatusHistory = cy.stub().resolves([])

    mountModal(datasetRepository)

    cy.findByText('There is no curation status history for this dataset.').should('exist')
  })

  it('formats the backend UTC date string without changing its time', () => {
    datasetRepository.getCurationStatusHistory = cy.stub().resolves([
      {
        label: 'Privacy Review',
        createTime: 'Tue Nov 10 19:12:33 UTC 2026',
        assignerDisplayName: 'Dataverse Admin'
      }
    ])

    mountModal(datasetRepository)

    cy.findByText('2026-11-10 19:12:33').should('exist')
    cy.findByText('Tue Nov 10 19:12:33 UTC 2026').should('not.exist')
  })

  it('renders an error message when the history cannot be loaded', () => {
    datasetRepository.getCurationStatusHistory = cy.stub().rejects(new Error('Forbidden'))

    mountModal(datasetRepository)

    cy.findByText('Something went wrong getting the curation status history. Try again later.', {
      exact: false
    }).should('exist')
  })

  it('does not load the history while hidden', () => {
    datasetRepository.getCurationStatusHistory = cy.stub().resolves([])

    mountModal(datasetRepository, false)

    cy.findByRole('dialog').should('not.exist')
    cy.wrap(datasetRepository.getCurationStatusHistory).should('not.have.been.called')
  })

  it('calls handleClose when the close button is clicked', () => {
    datasetRepository.getCurationStatusHistory = cy.stub().resolves([])

    mountModal(datasetRepository)

    cy.findAllByRole('button', { name: 'Close' }).last().click()
    cy.get('@handleClose').should('have.been.called')
  })
})
