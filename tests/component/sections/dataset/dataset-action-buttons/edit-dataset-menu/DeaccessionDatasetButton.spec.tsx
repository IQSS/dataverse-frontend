import {
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../dataset/domain/models/DatasetMother'
import { DeaccessionDatasetButton } from '../../../../../../src/sections/dataset/dataset-action-buttons/edit-dataset-menu/DeaccessionDatasetButton'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetVersionSummaryInfoMother } from '@tests/component/dataset/domain/models/DatasetVersionSummaryInfoMother'
import { DatasetVersionSummaryInfo } from '@/dataset/domain/models/DatasetVersionSummaryInfo'

describe('DeaccessionDatasetButton', () => {
  const repository: DatasetRepository = {} as DatasetRepository
  const versionSummaries = [
    DatasetVersionSummaryInfoMother.create({
      versionNumber: '1.0',
      publishedOn: '2021-01-01',
      contributors: 'Contributors',
      summary: {}
    }),
    DatasetVersionSummaryInfoMother.create({
      versionNumber: '2.0',
      publishedOn: '2021-01-02',
      contributors: 'Contributors',
      summary: {}
    }),
    DatasetVersionSummaryInfoMother.create({
      versionNumber: '3.0',
      publishedOn: '2021-01-22',
      contributors: 'Contributors',
      summary: {}
    })
  ]

  beforeEach(() => {
    repository.getDatasetVersionsSummaries = cy.stub().resolves(versionSummaries)
  })

  it('renders the DeaccessionDatasetButton if the user has publish dataset permissions and the dataset is released', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      version: DatasetVersionMother.createReleased()
    })

    cy.customMount(<DeaccessionDatasetButton datasetRepository={repository} dataset={dataset} />)

    cy.findByRole('separator').should('exist')
    cy.findByRole('button', { name: 'Deaccession Dataset' }).should('exist')
  })

  it('does not render the DeaccessionDatasetButton if the user does not have publish dataset permissions', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithPublishingDatasetNotAllowed(),
      version: DatasetVersionMother.createReleased()
    })

    cy.customMount(<DeaccessionDatasetButton datasetRepository={repository} dataset={dataset} />)

    cy.findByRole('button', { name: 'Deaccession Dataset' }).should('not.exist')
  })

  it('does not render the DeaccessionDatasetButton if the dataset is not released', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      version: DatasetVersionMother.createNotReleased()
    })

    cy.customMount(<DeaccessionDatasetButton datasetRepository={repository} dataset={dataset} />)

    cy.findByRole('button', { name: 'Deaccession Dataset' }).should('not.exist')
  })

  describe('Tests the deaccession modal', () => {
    it('renders the DeaccessionDatasetButton and opens the modal on click', () => {
      const dataset = DatasetMother.create({
        permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
        version: DatasetVersionMother.createReleased()
      })

      cy.customMount(<DeaccessionDatasetButton dataset={dataset} datasetRepository={repository} />)

      cy.findByRole('button', { name: 'Deaccession Dataset' }).should('exist')
      cy.findByRole('button', { name: 'Deaccession Dataset' }).click()
      cy.get('div').contains('Deaccession Dataset').should('exist')
      cy.get('div').contains('Deaccession is permanent.').should('exist')
      cy.get('form').should('exist')
      cy.get('input[type="checkbox"]').should('have.length', 3)
      cy.get('select').should('exist')
      cy.get('textarea').should('exist')
    })

    it('displays the confirm modal when the deaccession modal is submitted', () => {
      const dataset = DatasetMother.create({
        permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
        version: DatasetVersionMother.createReleased()
      })

      cy.customMount(<DeaccessionDatasetButton dataset={dataset} datasetRepository={repository} />)

      cy.findByRole('button', { name: 'Deaccession Dataset' }).click()
      cy.get('select').select('IRB request.')
      cy.get('input[type="checkbox"]').first().check()
      cy.findByRole('button', { name: 'Continue' }).click()
      cy.findByText('Confirm Deaccession').should('exist')
    })

    it('does not render versionList if it only contains one published element', () => {
      repository.deaccession = cy.stub().resolves()
      const singleVersionList = [
        DatasetVersionSummaryInfoMother.create({
          versionNumber: '1.0',
          publishedOn: '2021-01-01'
        }),
        DatasetVersionSummaryInfoMother.create({
          versionNumber: undefined,
          publishedOn: undefined,
          contributors: 'Contributors',
          summary: {}
        })
      ]

      repository.getDatasetVersionsSummaries = cy.stub().resolves(singleVersionList)

      const dataset = DatasetMother.create({
        permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
        version: DatasetVersionMother.createReleased()
      })

      cy.customMount(<DeaccessionDatasetButton dataset={dataset} datasetRepository={repository} />)

      cy.findByRole('button', { name: 'Deaccession Dataset' }).click()
      cy.get('form').should('exist')
      cy.findByTestId('published-versions').should('not.exist')
    })

    it('only renders version if it is published', () => {
      const singleVersionList: DatasetVersionSummaryInfo[] = [
        {
          id: 1,
          versionNumber: '1.0',
          publishedOn: '2021-01-01',
          contributors: 'Contributors',
          summary: {}
        },
        {
          id: 2,
          versionNumber: '2.0',
          publishedOn: '2021-01-02',
          contributors: 'Contributors',
          summary: {}
        },
        {
          id: 3,
          versionNumber: 'draft',
          publishedOn: undefined,
          contributors: 'Contributors',
          summary: {}
        }
      ]
      repository.getDatasetVersionsSummaries = cy.stub().resolves(singleVersionList)

      const dataset = DatasetMother.create({
        permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
        version: DatasetVersionMother.createReleased()
      })

      cy.customMount(<DeaccessionDatasetButton dataset={dataset} datasetRepository={repository} />)

      cy.findByRole('button', { name: 'Deaccession Dataset' }).click()
      cy.get('form').should('exist')
      cy.findByText('1.0 - 2021-01-01').should('exist')
      cy.findByText('2.0 - 2021-01-02').should('exist')
      cy.findByText('draft -').should('not.exist')
    })

    it('displays validation error messages', () => {
      const dataset = DatasetMother.create({
        permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
        version: DatasetVersionMother.createReleased()
      })

      cy.customMount(<DeaccessionDatasetButton dataset={dataset} datasetRepository={repository} />)

      cy.findByRole('button', { name: 'Deaccession Dataset' }).click()
      cy.get('form').should('exist')
      cy.findByTestId('deaccession-forward-url').type('bad-url')
      cy.findByRole('button', { name: 'Continue' }).click()
      cy.get('div').contains('Please select at least one version to deaccession.').should('exist')
      cy.get('div')
        .contains('Please select a reason for deaccessioning this dataset.')
        .should('exist')
      cy.get('div').contains('Please enter a valid URL').should('exist')
    })

    it('submits the form', () => {
      repository.deaccession = cy.stub().resolves()
      const dataset = DatasetMother.create({
        permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
        version: DatasetVersionMother.createReleased()
      })

      cy.customMount(<DeaccessionDatasetButton dataset={dataset} datasetRepository={repository} />)

      cy.findByRole('button', { name: 'Deaccession Dataset' }).click()
      cy.get('input[type="checkbox"]').first().check()

      cy.get('select').select('IRB request.')
      cy.get('textarea').type('Additional information')
      cy.findByTestId('deaccession-forward-url').type('https://example.com')
      cy.findByRole('button', { name: 'Continue' }).click()
      cy.get('button').contains('Yes', { timeout: 10000 }).should('exist').click()
      cy.wrap(repository.deaccession).should(
        'be.calledWithMatch',
        dataset.persistentId,
        versionSummaries[0].versionNumber,
        {
          deaccessionReason: 'IRB request. Additional information',
          deaccessionForwardUrl: 'https://example.com'
        }
      )
    })

    it('displays deaccession error message', () => {
      repository.deaccession = cy.stub().rejects(new Error('Deaccession error'))
      const dataset = DatasetMother.create({
        permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
        version: DatasetVersionMother.createReleased()
      })

      cy.customMount(<DeaccessionDatasetButton dataset={dataset} datasetRepository={repository} />)

      cy.findByRole('button', { name: 'Deaccession Dataset' }).click()
      cy.get('input[type="checkbox"]').first().check()
      cy.get('select').select('IRB request.')
      cy.get('textarea').type('Additional information')
      cy.findByTestId('deaccession-forward-url').type('https://example.com')
      cy.findByRole('button', { name: 'Continue' }).click()
      cy.get('button').contains('Yes').should('exist').click()
      cy.get('div').contains('Deaccession error').should('exist')
    })

    it('calls the repository.deaccession once for every version selected', () => {
      const versionSummary1 = DatasetVersionSummaryInfoMother.create({
        versionNumber: '1.0',
        publishedOn: '2021-01-01',
        id: 1
      })
      const versionSummary2 = DatasetVersionSummaryInfoMother.create({
        versionNumber: '2.0',
        publishedOn: '2021-01-02',
        id: 2
      })
      repository.getDatasetVersionsSummaries = cy
        .stub()
        .resolves([versionSummary1, versionSummary2])
      repository.deaccession = cy.stub().resolves()
      const dataset = DatasetMother.create({
        permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
        version: DatasetVersionMother.createReleased()
      })

      cy.customMount(<DeaccessionDatasetButton dataset={dataset} datasetRepository={repository} />)

      cy.findByRole('button', { name: 'Deaccession Dataset' }).click()
      cy.get('input[type="checkbox"]').first().check()
      cy.get('input[type="checkbox"]').eq(1).check()
      cy.get('select').select('IRB request.')
      cy.get('textarea').type('Additional information')
      cy.findByTestId('deaccession-forward-url').type('https://example.com')
      cy.findByRole('button', { name: 'Continue' }).click()
      cy.get('button').contains('Yes').should('exist').click()
      cy.wrap(repository.deaccession).should('have.callCount', 2)
    })

    it('does not show deaccessioned versions in the version list', () => {
      const versionsSummaries: DatasetVersionSummaryInfo[] = [
        {
          id: 1,
          versionNumber: '1.0',
          publishedOn: '2021-01-01',
          contributors: 'Contributors',
          summary: {
            deaccessioned: {
              reason: 'IRB request.',
              url: 'https://example.com'
            }
          }
        },
        {
          id: 2,
          versionNumber: '2.0',
          publishedOn: '2021-01-02',
          contributors: 'Contributors',
          summary: {}
        },
        {
          id: 3,
          versionNumber: '3.0',
          publishedOn: '2021-01-22',
          contributors: 'Contributors',
          summary: {}
        }
      ]
      repository.getDatasetVersionsSummaries = cy.stub().resolves(versionsSummaries)
      const dataset = DatasetMother.create({
        permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
        version: DatasetVersionMother.createReleased()
      })

      cy.customMount(<DeaccessionDatasetButton dataset={dataset} datasetRepository={repository} />)

      cy.findByRole('button', { name: 'Deaccession Dataset' }).click()
      cy.get('form').should('exist')
      cy.findByText('1.0 - 2021-01-01').should('not.exist')
      cy.findByText('2.0 - 2021-01-02').should('exist')
      cy.findByText('3.0 - 2021-01-22').should('exist')
      cy.get('input[type="checkbox"]').should('have.length', 2)
    })

    it('does not show versions list if there is only one deaccessioned version available', () => {
      const versionsSummaries: DatasetVersionSummaryInfo[] = [
        {
          id: 1,
          versionNumber: '1.0',
          publishedOn: '2021-01-01',
          contributors: 'Contributors',
          summary: {
            deaccessioned: {
              reason: 'IRB request.',
              url: 'https://example.com'
            }
          }
        },
        {
          id: 2,
          versionNumber: '2.0',
          publishedOn: '2021-01-02',
          contributors: 'Contributors',
          summary: {}
        }
      ]

      repository.getDatasetVersionsSummaries = cy.stub().resolves(versionsSummaries)

      const dataset = DatasetMother.create({
        permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
        version: DatasetVersionMother.createReleased()
      })

      cy.customMount(<DeaccessionDatasetButton dataset={dataset} datasetRepository={repository} />)

      cy.findByRole('button', { name: 'Deaccession Dataset' }).click()
      cy.get('form').should('exist')
      cy.findByText('1.0 - 2021-01-01').should('not.exist')
      cy.findByText('2.0 - 2021-01-02').should('not.exist')
    })
  })
})
