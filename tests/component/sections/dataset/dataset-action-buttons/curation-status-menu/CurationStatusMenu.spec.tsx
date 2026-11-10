import { WriteError } from '@iqss/dataverse-client-javascript'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { CurationStatusMenu } from '@/sections/dataset/dataset-action-buttons/curation-status-menu/CurationStatusMenu'
import {
  DatasetCurationStatusContext,
  DatasetCurationStatusContextProps
} from '@/sections/dataset/dataset-curation-status/DatasetCurationStatusContext'
import { WithRepositories } from '@tests/component/WithRepositories'

const datasetId = 'doi:10.5072/FK2/ABC123'
const allowedLabels = ['Author Contacted', 'Privacy Review']

const curatorContext = (
  overrides: Partial<DatasetCurationStatusContextProps> = {}
): DatasetCurationStatusContextProps => ({
  currentStatus: null,
  allowedLabels,
  canSeeCurationStatus: true,
  canChangeCurationStatus: true,
  refreshCurationStatus: cy.stub().as('refreshCurationStatus'),
  ...overrides
})

const mountMenu = (
  datasetRepository: DatasetRepository,
  context: DatasetCurationStatusContextProps
) =>
  cy.mountAuthenticated(
    <WithRepositories datasetRepository={datasetRepository}>
      <DatasetCurationStatusContext.Provider value={context}>
        <CurationStatusMenu datasetId={datasetId} />
      </DatasetCurationStatusContext.Provider>
    </WithRepositories>
  )

const openChangeStatusMenu = () => {
  cy.findByRole('button', { name: 'Curation Status' }).click()
  cy.findByRole('button', { name: 'Change Curation Status' }).click()
}

describe('CurationStatusMenu', () => {
  let datasetRepository: DatasetRepository

  beforeEach(() => {
    datasetRepository = {} as DatasetRepository
    datasetRepository.setCurationStatus = cy.stub().resolves()
    datasetRepository.deleteCurationStatus = cy.stub().resolves()
    datasetRepository.getCurationStatusHistory = cy.stub().resolves([])
  })

  it('renders every allowed label, remove and history options for a curator', () => {
    mountMenu(datasetRepository, curatorContext())

    openChangeStatusMenu()

    cy.findByRole('button', { name: 'Author Contacted' }).should('exist')
    cy.findByRole('button', { name: 'Privacy Review' }).should('exist')
    cy.findByRole('button', { name: 'Remove Current Status' }).should('exist')
    cy.findByRole('button', { name: 'View Curation Status History' }).should('exist')
  })

  it('opens the status list to the left with a left-pointing arrow after left-aligned text', () => {
    cy.viewport(1200, 800)
    cy.mountAuthenticated(
      <WithRepositories datasetRepository={datasetRepository}>
        <DatasetCurationStatusContext.Provider value={curatorContext()}>
          <div style={{ marginLeft: 600, width: 300 }}>
            <CurationStatusMenu datasetId={datasetId} />
          </div>
        </DatasetCurationStatusContext.Provider>
      </WithRepositories>
    )
    openChangeStatusMenu()
    cy.findByRole('button', { name: 'Change Curation Status' }).should(($toggle) => {
      const toggle = $toggle[0]
      const style = getComputedStyle(toggle)
      const arrow = getComputedStyle(toggle, '::before')
      expect(style.textAlign).to.equal('left')
      expect(style.flexDirection).to.equal('row-reverse')
      expect(style.justifyContent).to.equal('flex-end')
      expect(parseFloat(arrow.borderRightWidth)).to.be.greaterThan(0)
      expect(parseFloat(arrow.borderLeftWidth)).to.equal(0)
      const menu = toggle.parentElement?.querySelector('.dropdown-menu')
      expect(menu).to.exist
      if (!menu) throw new Error('Status submenu not found')
      expect(menu.getBoundingClientRect().right).to.be.at.most(
        toggle.getBoundingClientRect().left + 1
      )
    })
    cy.findByRole('button', { name: 'View Curation Status History' }).should('be.visible')
  })

  it('does not render when the user cannot see the curation status', () => {
    mountMenu(datasetRepository, curatorContext({ canSeeCurationStatus: false }))

    cy.findByRole('button', { name: 'Curation Status' }).should('not.exist')
  })

  it('does not render when labels are disabled and there is no current status', () => {
    mountMenu(
      datasetRepository,
      curatorContext({ allowedLabels: [], canChangeCurationStatus: false })
    )

    cy.findByRole('button', { name: 'Curation Status' }).should('not.exist')
  })

  it('only offers the history to users who can see but not change the status', () => {
    mountMenu(
      datasetRepository,
      curatorContext({
        allowedLabels: [],
        canChangeCurationStatus: false,
        currentStatus: { label: 'Privacy Review' }
      })
    )

    cy.findByRole('button', { name: 'Curation Status' }).click()
    cy.findByRole('button', { name: 'Change Curation Status' }).should('not.exist')
    cy.findByRole('button', { name: 'View Curation Status History' }).should('exist')
  })

  it('sets the selected label and refreshes the status', () => {
    mountMenu(datasetRepository, curatorContext())

    openChangeStatusMenu()
    cy.findByRole('button', { name: 'Privacy Review' }).click()

    cy.wrap(datasetRepository.setCurationStatus).should(
      'have.been.calledWith',
      datasetId,
      'Privacy Review'
    )
    cy.findByText('Curation Status is now "Privacy Review"').should('exist')
    cy.get('@refreshCurationStatus').should('have.been.called')
  })

  it('disables the current label and enables removing it', () => {
    mountMenu(datasetRepository, curatorContext({ currentStatus: { label: 'Privacy Review' } }))

    openChangeStatusMenu()

    cy.findByRole('button', { name: 'Privacy Review' }).should('have.class', 'disabled')
    cy.findByRole('button', { name: 'Remove Current Status' }).click()

    cy.wrap(datasetRepository.deleteCurationStatus).should('have.been.calledWith', datasetId)
    cy.findByText('Curation Status Removed').should('exist')
    cy.get('@refreshCurationStatus').should('have.been.called')
  })

  it('disables removing when there is no current status', () => {
    mountMenu(datasetRepository, curatorContext())

    openChangeStatusMenu()

    cy.findByRole('button', { name: 'Remove Current Status' }).should('have.class', 'disabled')
  })

  it('shows the server rejection reason when the status cannot be changed', () => {
    datasetRepository.setCurationStatus = cy
      .stub()
      .rejects(new WriteError('[400] Status labeling disabled for this dataset'))

    mountMenu(datasetRepository, curatorContext())

    openChangeStatusMenu()
    cy.findByRole('button', { name: 'Author Contacted' }).click()

    cy.findByText('Status labeling disabled for this dataset').should('exist')
    cy.get('@refreshCurationStatus').should('not.have.been.called')
  })

  it('shows a generic message when the error is not a WriteError', () => {
    datasetRepository.deleteCurationStatus = cy.stub().rejects(new Error('boom'))

    mountMenu(datasetRepository, curatorContext({ currentStatus: { label: 'Privacy Review' } }))

    openChangeStatusMenu()
    cy.findByRole('button', { name: 'Remove Current Status' }).click()

    cy.findByText('Unable to change Curation Status. Please contact the administrator.').should(
      'exist'
    )
  })

  it('opens the curation status history modal', () => {
    mountMenu(datasetRepository, curatorContext())

    cy.findByRole('button', { name: 'Curation Status' }).click()
    cy.findByRole('button', { name: 'View Curation Status History' }).click()

    cy.findByRole('dialog').should('exist')
    cy.findByText('Curation Status History').should('exist')
    cy.wrap(datasetRepository.getCurationStatusHistory).should('have.been.calledWith', datasetId)
  })
})
