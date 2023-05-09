import { createSandbox, SinonSandbox } from 'sinon'
import { DatasetRepository } from '../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '../../../tests/dataset/domain/models/DatasetMother'
import { DatasetSummary } from '../../../src/sections/dataset/datasetSummary/DatasetSummary'

describe('DatasetSummary', () => {
  const sandbox: SinonSandbox = createSandbox()
  const testDataset = DatasetMother.create()

  afterEach(() => {
    sandbox.restore()
  })

  it('renders the DatasetSummary fields', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getById = sandbox.stub().resolves(testDataset)

    cy.mount(<DatasetSummary datasetRepository={datasetRepository} id={testDataset.id} />)
    testDataset.summaryFields.map((field) => {
      cy.findByText(field.title).should('exist')
      cy.findByText(field.value).should('exist')
    })

    cy.get('img').should('exist')
    cy.findByText(testDataset.license.name).should('exist')
  })
})
