import { createSandbox, SinonSandbox } from 'sinon'
import { DatasetRepository } from '../../../src/dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../../src/sections/dataset/Dataset'
import { DatasetMother } from '../../../tests/dataset/domain/models/DatasetMother'

describe('Dataset', () => {
  const sandbox: SinonSandbox = createSandbox()
  const testDataset = DatasetMother.create()

  afterEach(() => {
    sandbox.restore()
  })

  it('renders the Dataset page title and version', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getById = sandbox.stub().resolves(testDataset)

    cy.mount(<Dataset datasetRepository={datasetRepository} id={testDataset.id} />)

    cy.findByText(testDataset.title).should('exist')

    testDataset.labels.forEach((label) => {
      cy.findByText(label.value).should('exist')
    })
  })
})
