import { Collection } from '../../../../src/sections/collection/Collection'
import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetPreviewMother } from '../../dataset/domain/models/DatasetPreviewMother'
import { CollectionRepository } from '../../../../src/collection/domain/repositories/CollectionRepository'
import { CollectionMother } from '../../collection/domain/models/CollectionMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const totalDatasetsCount = 200
const datasets = DatasetPreviewMother.createMany(totalDatasetsCount)
const collectionRepository = {} as CollectionRepository
const collection = CollectionMother.create({ name: 'Collection Name' })
const datasetsWithCount = { datasetPreviews: datasets, totalCount: totalDatasetsCount }

describe('Collection page', () => {
  beforeEach(() => {
    datasetRepository.getAllWithCount = cy.stub().resolves(datasetsWithCount)
    collectionRepository.getById = cy.stub().resolves(collection)
  })

  it('renders skeleton while loading', () => {
    cy.customMount(
      <Collection
        repository={collectionRepository}
        id="collection"
        datasetRepository={datasetRepository}
      />
    )

    cy.findByTestId('collection-skeleton').should('exist')
    cy.findByRole('heading', { name: 'Collection Name' }).should('not.exist')
  })

  it('renders page not found when collection is undefined', () => {
    collectionRepository.getById = cy.stub().resolves(undefined)
    cy.customMount(
      <Collection
        repository={collectionRepository}
        id="collection"
        datasetRepository={datasetRepository}
      />
    )

    cy.findByText('Page Not Found').should('exist')
  })

  it('renders the breadcrumbs', () => {
    cy.customMount(
      <Collection
        repository={collectionRepository}
        id="collection"
        datasetRepository={datasetRepository}
      />
    )

    cy.findByText('Root').should('exist')
  })

  it('renders collection title', () => {
    cy.customMount(
      <Collection
        repository={collectionRepository}
        id="collection"
        datasetRepository={datasetRepository}
      />
    )
    cy.findByRole('heading', { name: 'Collection Name' }).should('exist')
  })

  it('does not render the Add Data dropdown button', () => {
    cy.customMount(
      <Collection
        repository={collectionRepository}
        datasetRepository={datasetRepository}
        id="collection"
      />
    )
    cy.findByRole('button', { name: /Add Data/i }).should('not.exist')
  })

  it('does render the Add Data dropdown button when user logged in', () => {
    cy.mountAuthenticated(
      <Collection
        repository={collectionRepository}
        datasetRepository={datasetRepository}
        id="collection"
      />
    )

    cy.findByRole('button', { name: /Add Data/i })
      .should('exist')
      .click()
    cy.findByText('New Collection').should('be.visible')
    cy.findByText('New Dataset').should('be.visible')
  })

  it('renders the datasets list', () => {
    cy.customMount(
      <Collection
        repository={collectionRepository}
        datasetRepository={datasetRepository}
        id="collection"
      />
    )

    cy.findByText('1 to 10 of 200 Datasets').should('exist')

    datasets.forEach((dataset) => {
      cy.findByText(dataset.version.title).should('exist')
    })
  })

  it('renders the correct page when passing the page number as a query param', () => {
    cy.customMount(
      <Collection
        repository={collectionRepository}
        datasetRepository={datasetRepository}
        page={5}
        id="collection"
      />
    )

    cy.findByText('41 to 50 of 200 Datasets').should('exist')
  })

  it('renders the datasets list with infinite scrolling enabled', () => {
    const first10Elements = datasets.slice(0, 10)

    datasetRepository.getAllWithCount = cy.stub().resolves({
      datasetPreviews: first10Elements,
      totalCount: totalDatasetsCount
    })

    cy.customMount(
      <Collection
        repository={collectionRepository}
        datasetRepository={datasetRepository}
        id="collection"
        infiniteScrollEnabled
      />
    )

    cy.findByText('10 of 200 Datasets seen').should('exist')

    first10Elements.forEach((dataset) => {
      cy.findByText(dataset.version.title).should('exist')
    })
  })
})
