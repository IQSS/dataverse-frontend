import { DatasetRepository } from '../../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetsList } from '../../../../../src/sections/collection/datasets-list/DatasetsList'
import { DatasetPreviewMother } from '../../../dataset/domain/models/DatasetPreviewMother'
import { DatasetPreview } from '@iqss/dataverse-client-javascript'
import { DatasetPaginationInfo } from '../../../../../src/dataset/domain/models/DatasetPaginationInfo'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const totalDatasetsCount = 200
const datasets = DatasetPreviewMother.createMany(totalDatasetsCount)
const datasetsWithCount = { datasetPreviews: datasets, totalCount: totalDatasetsCount }
describe('Datasets List', () => {
  beforeEach(() => {
    datasetRepository.getAllWithCount = cy.stub().resolves(datasetsWithCount)
  })

  it('renders skeleton while loading', () => {
    cy.customMount(<DatasetsList datasetRepository={datasetRepository} collectionId="root" />)

    cy.findByTestId('datasets-list-skeleton').should('exist')
    datasets.forEach((dataset) => {
      cy.findByRole('link', { name: dataset.version.title }).should('not.exist')
    })
  })

  it('renders no datasets message when there are no datasets', () => {
    const emptyDatasets: DatasetPreview[] = []
    const emptyDatasetsWithCount = { datasetPreviews: emptyDatasets, totalCount: 0 }
    datasetRepository.getAllWithCount = cy.stub().resolves(emptyDatasetsWithCount)
    cy.customMount(<DatasetsList datasetRepository={datasetRepository} collectionId="root" />)

    cy.findByText(/This collection currently has no datasets./).should('exist')
  })

  it('renders the datasets list', () => {
    cy.customMount(<DatasetsList datasetRepository={datasetRepository} collectionId="root" />)

    cy.wrap(datasetRepository.getAllWithCount).should(
      'be.calledOnceWith',
      'root',
      new DatasetPaginationInfo(1, 10, 0)
    )
    cy.findByText('1 to 10 of 200 Datasets').should('exist')
    datasets.forEach((dataset) => {
      cy.findByText(dataset.version.title)
        .should('exist')
        .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}`)
    })
  })

  it('renders the datasets list with the correct header on a page different than the first one ', () => {
    cy.customMount(<DatasetsList datasetRepository={datasetRepository} collectionId="root" />)

    cy.findByRole('button', { name: '6' }).click()
    cy.wrap(datasetRepository.getAllWithCount).should(
      'be.calledWith',
      'root',
      new DatasetPaginationInfo(1, 10, 200).goToPage(6)
    )
    cy.findByText('51 to 60 of 200 Datasets').should('exist')
  })

  it('renders the datasets list correct page when passing the page number as a query param', () => {
    cy.customMount(
      <DatasetsList datasetRepository={datasetRepository} page={5} collectionId="root" />
    )
    cy.wrap(datasetRepository.getAllWithCount).should(
      'be.calledWith',
      'root',
      new DatasetPaginationInfo(1, 10, 0).goToPage(5)
    )
    cy.findByText('41 to 50 of 200 Datasets').should('exist')
  })

  it('renders the page not found message when the page number is not found', () => {
    cy.customMount(
      <DatasetsList datasetRepository={datasetRepository} page={100} collectionId="root" />
    )

    cy.findByText('Page Number Not Found').should('exist')
  })
})
