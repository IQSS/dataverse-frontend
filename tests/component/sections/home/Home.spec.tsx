import { Home } from '../../../../src/sections/home/Home'
import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetPreviewMother } from '../../dataset/domain/models/DatasetPreviewMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const totalDatasetsCount = 200
const datasets = DatasetPreviewMother.createMany(totalDatasetsCount)
describe('Home page', () => {
  beforeEach(() => {
    datasetRepository.getAll = cy.stub().resolves(datasets)
    datasetRepository.getTotalDatasetsCount = cy.stub().resolves(totalDatasetsCount)
  })

  it('renders Root title', () => {
    cy.customMount(<Home datasetRepository={datasetRepository} />)
    cy.findByRole('heading').should('contain.text', 'Root')
  })

  it('renders the datasets list', () => {
    cy.customMount(<Home datasetRepository={datasetRepository} />)

    cy.findByText('1 to 10 of 200 Datasets').should('exist')

    datasets.forEach((dataset) => {
      cy.findByText(dataset.title).should('exist')
    })
  })

  it('renders the home correct page when passing the page number as a query param', () => {
    cy.customMount(<Home datasetRepository={datasetRepository} page={5} />)

    cy.findByText('41 to 50 of 200 Datasets').should('exist')
  })
})
