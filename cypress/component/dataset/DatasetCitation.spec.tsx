import { createSandbox, SinonSandbox } from 'sinon'
import { DatasetRepository } from '../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '../../../tests/dataset/domain/models/DatasetMother'
import { DatasetCitation } from '../../../src/sections/dataset/datasetCitation/DatasetCitation'
import { ThemeProvider } from '../../../src/sections/ui/theme/ThemeProvider'

describe('DatasetCitation', () => {
  const sandbox: SinonSandbox = createSandbox()
  const testDataset = DatasetMother.create()

  afterEach(() => {
    sandbox.restore()
  })

  it('renders the DatasetCitation fields', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getById = sandbox.stub().resolves(testDataset)
    // TODO: remove ThemeProvider and replace with customMount()
    cy.mount(
      <ThemeProvider>
        <DatasetCitation datasetRepository={datasetRepository} id={testDataset.id} />
      </ThemeProvider>
    )
    cy.findByText('Dropdown Citation').should('exist')
  })
})
