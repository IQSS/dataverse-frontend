import { Collection } from '../../../../src/sections/collection/Collection'
import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetPreviewMother } from '../../dataset/domain/models/DatasetPreviewMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const totalDatasetsCount = 200
const datasets = DatasetPreviewMother.createMany(totalDatasetsCount)
describe('Collection page', () => {
  beforeEach(() => {
    datasetRepository.getAll = cy.stub().resolves(datasets)
    datasetRepository.getTotalDatasetsCount = cy.stub().resolves(totalDatasetsCount)
  })

  it('renders collection title', () => {
    cy.customMount(<Collection datasetRepository={datasetRepository} id="collection" />)
    cy.findByRole('heading').should('contain.text', 'Collection')
  })

  it('renders the datasets list', () => {
    cy.customMount(<Collection datasetRepository={datasetRepository} id="collection" />)

    cy.findByText('1 to 10 of 200 Datasets').should('exist')

    datasets.forEach((dataset) => {
      cy.findByText(dataset.version.title).should('exist')
    })
  })

  it('renders the correct page when passing the page number as a query param', () => {
    cy.customMount(<Collection datasetRepository={datasetRepository} page={5} id="collection" />)

    cy.findByText('41 to 50 of 200 Datasets').should('exist')
  })
})
