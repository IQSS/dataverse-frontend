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
describe('Collection page', () => {
  beforeEach(() => {
    datasetRepository.getAll = cy.stub().resolves(datasets)
    datasetRepository.getTotalDatasetsCount = cy.stub().resolves(totalDatasetsCount)
    collectionRepository.getById = cy.stub().resolves(collection)
  })

  it('renders collection title', () => {
    cy.customMount(
      <Collection
        repository={collectionRepository}
        id="collection"
        datasetRepository={datasetRepository}
      />
    )
    cy.findByRole('heading').should('contain.text', 'Collection Name')
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
})
