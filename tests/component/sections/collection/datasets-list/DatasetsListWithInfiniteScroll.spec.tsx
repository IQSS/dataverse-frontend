import { DatasetRepository } from '../../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetsListWithInfiniteScroll } from '../../../../../src/sections/collection/datasets-list/DatasetsListWithInfiniteScroll'
import { DatasetPreviewMother } from '../../../dataset/domain/models/DatasetPreviewMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const totalDatasetsCount = 200
const datasets = DatasetPreviewMother.createMany(totalDatasetsCount)
const first10Elements = datasets.slice(0, 10)
const only4DatasetsCount = 4

describe('Datasets List with Infinite Scroll', () => {
  beforeEach(() => {
    datasetRepository.getAllWithCount = cy.stub().resolves({
      datasetPreviews: first10Elements,
      totalCount: totalDatasetsCount
    })
  })
  it('renders skeleton while loading', () => {
    cy.customMount(
      <DatasetsListWithInfiniteScroll datasetRepository={datasetRepository} collectionId="root" />
    )

    cy.findByTestId('datasets-list-infinite-scroll-skeleton').should('exist')
    datasets.forEach((dataset) => {
      cy.findByRole('link', { name: dataset.version.title }).should('not.exist')
    })
  })

  it('renders no datasets message when there are no datasets', () => {
    datasetRepository.getAllWithCount = cy.stub().resolves({
      datasetPreviews: [],
      totalCount: 0
    })

    cy.customMount(
      <DatasetsListWithInfiniteScroll datasetRepository={datasetRepository} collectionId="root" />
    )

    cy.findByText(/This dataverse currently has no datasets./).should('exist')
  })

  it('renders the first 10 datasets', () => {
    cy.customMount(
      <DatasetsListWithInfiniteScroll datasetRepository={datasetRepository} collectionId="root" />
    )

    cy.findByText('10 of 200 Datasets seen').should('exist')
    first10Elements.forEach((dataset) => {
      cy.findByText(dataset.version.title)
        .should('exist')
        .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}`)
    })
  })

  it('renders the first 10 datasets and more to load so loading bottom skeleton visible but not skeleton header', () => {
    cy.customMount(
      <DatasetsListWithInfiniteScroll datasetRepository={datasetRepository} collectionId="root" />
    )

    first10Elements.forEach((dataset) => {
      cy.findByText(dataset.version.title)
        .should('exist')
        .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}`)
    })
    cy.findByTestId('datasets-list-infinite-scroll-skeleton-header').should('not.exist')
    cy.findByTestId('datasets-list-infinite-scroll-skeleton').should('exist')
  })

  it('renders 4 datasets and no more to load and correct results in header and bottom skeleton loader shouldn´t exist', () => {
    const first4Elements = datasets.slice(0, only4DatasetsCount)
    datasetRepository.getAllWithCount = cy.stub().resolves({
      datasetPreviews: first4Elements,
      totalCount: only4DatasetsCount
    })
    cy.customMount(
      <DatasetsListWithInfiniteScroll datasetRepository={datasetRepository} collectionId="root" />
    )

    cy.findByText(`${only4DatasetsCount} Datasets`).should('exist')
    first4Elements.forEach((dataset) => {
      cy.findByText(dataset.version.title)
        .should('exist')
        .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}`)
    })
    cy.findByTestId('datasets-list-infinite-scroll-skeleton').should('not.exist')
  })

  it('renders error message when there is an error', () => {
    datasetRepository.getAllWithCount = cy.stub().rejects(new Error('some error'))

    cy.customMount(
      <DatasetsListWithInfiniteScroll datasetRepository={datasetRepository} collectionId="root" />
    )

    cy.findByText('Error').should('exist')
  })
})
