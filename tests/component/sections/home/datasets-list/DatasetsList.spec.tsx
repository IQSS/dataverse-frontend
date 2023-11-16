import { DatasetRepository } from '../../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
import { DatasetsList } from '../../../../../src/sections/home/datasets-list/DatasetsList'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const datasets = DatasetMother.createMany(10)
describe('Datasets List', () => {
  beforeEach(() => {
    datasetRepository.getAll = cy.stub().resolves(datasets)
  })

  it('renders the datasets list', () => {
    cy.customMount(<DatasetsList datasetRepository={datasetRepository} />)

    cy.wrap(datasetRepository.getAll).should('be.calledOnce')

    datasets.forEach((dataset) => {
      cy.findByRole('link', { name: dataset.getTitle() })
        .should('exist')
        .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}`)
    })
  })
})
