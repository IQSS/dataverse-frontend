import { DatasetRepository } from '../../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetsListWithInfiniteScroll } from '../../../../../src/sections/collection/datasets-list/DatasetsListWithInfiniteScroll'
import { DatasetPaginationInfo } from '../../../../../src/dataset/domain/models/DatasetPaginationInfo'
import { DatasetPreviewMother } from '../../../dataset/domain/models/DatasetPreviewMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const totalDatasetsCount = 200
const datasets = DatasetPreviewMother.createMany(totalDatasetsCount)
const only4DatasetsCount = 4

describe('Datasets List with Infinite Scroll', () => {
  beforeEach(() => {
    datasetRepository.getAll = cy.stub().resolves(datasets)
    datasetRepository.getTotalDatasetsCount = cy.stub().resolves(totalDatasetsCount)
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
    datasetRepository.getAll = cy.stub().resolves([])
    datasetRepository.getTotalDatasetsCount = cy.stub().resolves(0)

    cy.customMount(
      <DatasetsListWithInfiniteScroll datasetRepository={datasetRepository} collectionId="root" />
    )

    cy.findByText(/This dataverse currently has no datasets./).should('exist')
  })

  it('renders the first 10 datasets', () => {
    const first10Elements = datasets.slice(0, 10)
    datasetRepository.getAll = cy.stub().resolves(first10Elements)
    cy.customMount(
      <DatasetsListWithInfiniteScroll datasetRepository={datasetRepository} collectionId="root" />
    )

    cy.wrap(datasetRepository.getAll).should(
      'be.calledOnceWith',
      'root',
      new DatasetPaginationInfo(1, 10, totalDatasetsCount)
    )

    cy.findByText('10 of 200 Datasets seen').should('exist')
    first10Elements.forEach((dataset) => {
      cy.findByText(dataset.version.title)
        .should('exist')
        .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}`)
    })
  })

  it('renders the first 10 datasets and more to load so loading bottom skeleton visible but not skeleton header', () => {
    const first10Elements = datasets.slice(0, 10)
    datasetRepository.getAll = cy.stub().resolves(first10Elements)
    cy.customMount(
      <DatasetsListWithInfiniteScroll datasetRepository={datasetRepository} collectionId="root" />
    )

    cy.wrap(datasetRepository.getAll).should(
      'be.calledOnceWith',
      'root',
      new DatasetPaginationInfo(1, 10, totalDatasetsCount)
    )

    first10Elements.forEach((dataset) => {
      cy.findByText(dataset.version.title)
        .should('exist')
        .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}`)
    })
    cy.findByTestId('datasets-list-infinite-scroll-skeleton-header').should('not.exist')
    cy.findByTestId('datasets-list-infinite-scroll-skeleton').should('exist')
  })

  it('renders the first 10 datasets and correct results in header', () => {
    const first10Elements = datasets.slice(0, 10)
    datasetRepository.getAll = cy.stub().resolves(first10Elements)
    cy.customMount(
      <DatasetsListWithInfiniteScroll datasetRepository={datasetRepository} collectionId="root" />
    )

    cy.wrap(datasetRepository.getAll).should(
      'be.calledOnceWith',
      'root',
      new DatasetPaginationInfo(1, 10, totalDatasetsCount)
    )

    cy.findByText('10 of 200 Datasets seen').should('exist')
    first10Elements.forEach((dataset) => {
      cy.findByText(dataset.version.title)
        .should('exist')
        .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}`)
    })
  })

  it('renders 4 datasets and no more to load and correct resuls in header', () => {
    const first4Elements = datasets.slice(0, 4)
    datasetRepository.getAll = cy.stub().resolves(first4Elements)
    datasetRepository.getTotalDatasetsCount = cy.stub().resolves(only4DatasetsCount)
    cy.customMount(
      <DatasetsListWithInfiniteScroll datasetRepository={datasetRepository} collectionId="root" />
    )

    cy.wrap(datasetRepository.getAll).should(
      'be.calledOnceWith',
      'root',
      new DatasetPaginationInfo(1, 10, only4DatasetsCount)
    )

    cy.findByText(`${only4DatasetsCount} Datasets`).should('exist')
    first4Elements.forEach((dataset) => {
      cy.findByText(dataset.version.title)
        .should('exist')
        .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}`)
    })
    cy.findByTestId('datasets-list-infinite-scroll-skeleton').should('not.exist')
  })
})
