import { Home } from '../../../../src/sections/home/Home'
import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetPreviewMother } from '../../dataset/domain/models/DatasetPreviewMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const totalDatasetsCount = 10
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

    cy.wrap(datasetRepository.getAll).should('be.calledOnce')

    datasets.forEach((dataset) => {
      cy.findByText(dataset.title).should('exist')
    })
  })
})
