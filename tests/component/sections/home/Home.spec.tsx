import { Home } from '../../../../src/sections/home/Home'
import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const totalDatasetsCount = 10
const datasets = DatasetMother.createMany(totalDatasetsCount)
describe('Home page', () => {
  beforeEach(() => {
    datasetRepository.getAll = cy.stub().resolves(datasets)
    datasetRepository.getTotalDatasetsCount = cy.stub().resolves(totalDatasetsCount)
  })

  it('renders hello dataverse title', () => {
    cy.customMount(<Home datasetRepository={datasetRepository} />)
    cy.findByRole('heading').should('contain.text', 'Hello Dataverse')
  })

  it('renders the datasets list', () => {
    cy.customMount(<Home datasetRepository={datasetRepository} />)

    cy.wrap(datasetRepository.getAll).should('be.calledOnce')

    datasets.forEach((dataset) => {
      cy.findByText(dataset.title).should('exist')
    })
  })
})
