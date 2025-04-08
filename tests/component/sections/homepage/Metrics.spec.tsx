import { DataverseHubMockRepository } from '@/stories/dataverse-hub/DataverseHubMockRepository'
import { DataverseHubLoadingMockRepository } from '@/stories/dataverse-hub/DataverseHubLoadingMockRepository'
import { InstallationMetricsMother } from '@tests/component/dataverse-hub/domain/models/InstallationMetricsMother'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { Metrics } from '@/sections/homepage/metrics/Metrics'

describe('Metrics', () => {
  beforeEach(() => {
    cy.viewport(1440, 900)
  })

  it('shows skeleton while loading metrics', () => {
    cy.customMount(<Metrics dataverseHubRepository={new DataverseHubLoadingMockRepository()} />)
    cy.findByTestId('metrics-results-skeleton').should('exist')
  })

  it('shows metrics results', () => {
    cy.customMount(<Metrics dataverseHubRepository={new DataverseHubMockRepository()} />)
    // Datasets total
    cy.findByText('17K').should('be.visible')
    // Deposited Datasets
    cy.findByText('11K').should('be.visible')
    // Harvested Datasets
    cy.findByText('6K').should('be.visible')
    // Last month datasets
    cy.findByText('2K').should('be.visible')

    // Files Downloaded
    cy.findByText('18M').should('be.visible')
    // Deposited Files
    cy.findByText('3.5M').should('be.visible')
    // Files Downloaded last month
    cy.findByText('2.9M').should('be.visible')
    // Deposited Files last month
    cy.findByText('250K').should('be.visible')
  })

  it('shows last month metrics same as total if there is only one month of metrics', () => {
    const dataverseHubRepositoryWithOnlyOneMonthMetrics = new DataverseHubMockRepository()
    dataverseHubRepositoryWithOnlyOneMonthMetrics.getInstallationMetricsByHubId = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(InstallationMetricsMother.createInstallationMetricsWithOnlyOneMonthMetrics())
        }, FakerHelper.loadingTimout())
      })
    }

    cy.customMount(
      <Metrics dataverseHubRepository={dataverseHubRepositoryWithOnlyOneMonthMetrics} />
    )
    // Datasets total and last month
    cy.findAllByText('1K').should('be.visible').should('have.length', 2)
    // Deposited Datasets
    cy.findByText('800').should('be.visible')
    // Harvested Datasets
    cy.findByText('200').should('be.visible')

    // Files Downloaded and last month
    cy.findAllByText('120K').should('be.visible').should('have.length', 2)
    // Deposited Files and last month
    cy.findAllByText('15K').should('be.visible').should('have.length', 2)
  })

  describe('shows nothing if there are no metrics', () => {
    it('shows nothing if failed with an error instance', () => {
      const dataverseHubRepositoryWithNoMetrics = new DataverseHubMockRepository()
      dataverseHubRepositoryWithNoMetrics.getInstallationMetricsByHubId = cy
        .stub()
        .rejects(new Error('Some error'))

      cy.customMount(<Metrics dataverseHubRepository={dataverseHubRepositoryWithNoMetrics} />)
      cy.findByTestId('metrics-results').should('not.exist')
    })

    it('shows nothing if failed with an unknown error', () => {
      const dataverseHubRepositoryWithNoMetrics = new DataverseHubMockRepository()
      dataverseHubRepositoryWithNoMetrics.getInstallationMetricsByHubId = cy.stub().rejects()

      cy.customMount(<Metrics dataverseHubRepository={dataverseHubRepositoryWithNoMetrics} />)
      cy.findByTestId('metrics-results').should('not.exist')
    })
  })
})
