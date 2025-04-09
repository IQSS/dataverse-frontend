import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetMetrics } from '@/sections/dataset/dataset-metrics/DatasetMetrics'
import { DatasetMockRepository } from '@/stories/dataset/DatasetMockRepository'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { DatasetDownloadCountMother } from '@tests/component/dataset/domain/models/DatasetDownloadCountMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository

const datasetCountWihtoutMDC = DatasetDownloadCountMother.createWithoutMDCStartDate()

describe('DatasetMetrics', () => {
  it('should render skeleton when loading', () => {
    const DELAYED_TIME = 200
    datasetRepository.getDownloadCount = cy.stub().callsFake(() => {
      return Cypress.Promise.delay(DELAYED_TIME).then(() => datasetCountWihtoutMDC)
    })

    cy.customMount(<DatasetMetrics datasetRepository={datasetRepository} datasetId={1} />)

    cy.clock()

    cy.findByTestId('dataset-metrics-skeleton').should('exist')

    cy.tick(DELAYED_TIME)

    cy.findByTestId('dataset-metrics-skeleton').should('not.exist')

    cy.clock().then((clock) => clock.restore())
  })

  it('should render classic downloads when calling download count with MDC but not receiving MDCStartDate', () => {
    const datasetMockRepoWithoutMakeDataCount = new DatasetMockRepository()
    datasetMockRepoWithoutMakeDataCount.getDownloadCount = () => {
      return new Promise((resolve) => {
        resolve(DatasetDownloadCountMother.createWithoutMDCStartDate())
      })
    }

    cy.customMount(
      <DatasetMetrics datasetRepository={datasetMockRepoWithoutMakeDataCount} datasetId={1} />
    )

    cy.findByTestId('classic-download-count').should('exist').should('be.visible')
    cy.findByTestId('mdc-download-count').should('not.exist')

    cy.findByText('15 Downloads').should('exist')
  })

  it('should render MDC downloads when calling download count with MDC and receiving MDCStartDate', () => {
    cy.customMount(<DatasetMetrics datasetRepository={new DatasetMockRepository()} datasetId={1} />)

    cy.findByTestId('mdc-download-count').should('exist').should('be.visible')
    cy.findByTestId('classic-download-count').should('not.exist')

    cy.findByText(/Make Data Count \(MDC\) Metrics/).should('exist')

    cy.findByText(/2019-10-01/).should('exist')
    cy.findByText('10 Downloads').should('exist')
    cy.findByText('(+15 Downloads pre-MDC)').should('exist')
  })

  it('should not render anything when there is an unknown error while loading download count', () => {
    datasetRepository.getDownloadCount = cy.stub().rejects()

    cy.customMount(<DatasetMetrics datasetRepository={datasetRepository} datasetId={1} />)

    cy.findByTestId('dataset-metrics-skeleton').should('not.exist')
    cy.findByTestId('classic-download-count').should('not.exist')
    cy.findByTestId('mdc-download-count').should('not.exist')
  })

  it('should not render anything when there is an ReadError instance error while loading download count', () => {
    datasetRepository.getDownloadCount = cy.stub().rejects(new ReadError('Some error'))

    cy.customMount(<DatasetMetrics datasetRepository={datasetRepository} datasetId={1} />)

    cy.findByTestId('dataset-metrics-skeleton').should('not.exist')
    cy.findByTestId('classic-download-count').should('not.exist')
    cy.findByTestId('mdc-download-count').should('not.exist')
  })
})
