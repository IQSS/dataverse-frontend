import { createSandbox, SinonSandbox } from 'sinon'
import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../../../src/sections/dataset/Dataset'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'
import { LoadingProvider } from '../../../../src/sections/loading/LoadingProvider'
import { useLoading } from '../../../../src/sections/loading/LoadingContext'

describe('Dataset', () => {
  const sandbox: SinonSandbox = createSandbox()
  const testDataset = DatasetMother.create()

  afterEach(() => {
    sandbox.restore()
  })

  it('renders skeleton while loading', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getById = sandbox.stub().resolves(testDataset)

    const buttonText = 'Toggle Loading'
    const TestComponent = () => {
      const { isLoading, setIsLoading } = useLoading()
      return (
        <>
          <button onClick={() => setIsLoading(true)}>{buttonText}</button>
          {isLoading && <div>Loading...</div>}
        </>
      )
    }

    cy.customMount(
      <LoadingProvider>
        <Dataset datasetRepository={datasetRepository} id={testDataset.id} />
        <TestComponent />
      </LoadingProvider>
    )

    cy.findByText(buttonText).click()

    cy.findByTestId('dataset-skeleton').should('exist')
    cy.findByText(testDataset.title).should('not.exist')
  })

  it('renders page not found when dataset is null', () => {
    const emptyDataset = DatasetMother.createEmpty()
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getById = sandbox.stub().resolves(emptyDataset)

    cy.customMount(
      <LoadingProvider>
        <Dataset datasetRepository={datasetRepository} id="wrong-id" />
      </LoadingProvider>
    )

    cy.findByText('Page Not Found').should('exist')
  })

  it('renders the Dataset page title and labels', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getById = sandbox.stub().resolves(testDataset)

    cy.customMount(
      <LoadingProvider>
        <Dataset datasetRepository={datasetRepository} id={testDataset.id} />
      </LoadingProvider>
    )

    cy.findByText(testDataset.title).should('exist')

    testDataset.labels.forEach((label) => {
      cy.findAllByText(label.value).should('exist')
    })
  })
})
