import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../../../src/sections/dataset/Dataset'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'
import { LoadingProvider } from '../../../../src/sections/loading/LoadingProvider'
import { useLoading } from '../../../../src/sections/loading/LoadingContext'
import { ANONYMIZED_FIELD_VALUE } from '../../../../src/dataset/domain/models/Dataset'
import { AnonymizedContext } from '../../../../src/sections/dataset/anonymized/AnonymizedContext'

describe('Dataset', () => {
  const testDataset = DatasetMother.create()

  it('renders skeleton while loading', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getByPersistentId = cy.stub().resolves(testDataset)

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
        <Dataset
          repository={datasetRepository}
          searchParams={{ persistentId: testDataset.persistentId }}
        />
        <TestComponent />
      </LoadingProvider>
    )

    cy.findByText(buttonText).click()

    cy.findByTestId('dataset-skeleton').should('exist')
    cy.findByText(testDataset.getTitle()).should('not.exist')
  })

  it('renders page not found when dataset is null', () => {
    const emptyDataset = DatasetMother.createEmpty()
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getByPersistentId = cy.stub().resolves(emptyDataset)

    cy.customMount(
      <LoadingProvider>
        <Dataset repository={datasetRepository} searchParams={{ persistentId: 'wrong-id' }} />
      </LoadingProvider>
    )

    cy.findByText('Page Not Found').should('exist')
  })

  it('renders page not found when no searchParam is passed', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getByPersistentId = cy.stub().resolves(testDataset)

    cy.customMount(
      <LoadingProvider>
        <Dataset repository={datasetRepository} searchParams={{}} />
      </LoadingProvider>
    )

    cy.findByText('Page Not Found').should('exist')
  })

  it('renders the Dataset page title and labels', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getByPersistentId = cy.stub().resolves(testDataset)

    cy.customMount(
      <LoadingProvider>
        <Dataset
          repository={datasetRepository}
          searchParams={{ persistentId: testDataset.persistentId }}
        />
      </LoadingProvider>
    )

    cy.wrap(datasetRepository.getByPersistentId).should('be.calledWith', testDataset.persistentId)

    cy.findAllByText(testDataset.getTitle()).should('exist')

    testDataset.labels.forEach((label) => {
      cy.findAllByText(label.value).should('exist')
    })
  })

  it('renders the Dataset Metadata tab', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getByPersistentId = cy.stub().resolves(testDataset)

    cy.customMount(
      <LoadingProvider>
        <Dataset
          repository={datasetRepository}
          searchParams={{ persistentId: testDataset.persistentId }}
        />
      </LoadingProvider>
    )

    cy.findAllByText(testDataset.getTitle()).should('exist')

    const metadataTab = cy.findByRole('tab', { name: 'Metadata' })
    metadataTab.should('exist')

    metadataTab.click()

    cy.findByText('Citation Metadata').should('exist')
  })

  it('renders the Dataset in anonymized view', () => {
    const setAnonymizedView = () => {}
    const testDatasetAnonymized = DatasetMother.createAnonymized()
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getByPrivateUrlToken = cy.stub().resolves(testDatasetAnonymized)
    const privateUrlToken = 'some-token'

    cy.customMount(
      <LoadingProvider>
        <AnonymizedContext.Provider value={{ anonymizedView: true, setAnonymizedView }}>
          <Dataset
            repository={datasetRepository}
            searchParams={{ privateUrlToken: privateUrlToken }}
          />
        </AnonymizedContext.Provider>
      </LoadingProvider>
    )

    cy.wrap(datasetRepository.getByPrivateUrlToken).should('be.calledWith', privateUrlToken)

    cy.findByRole('tab', { name: 'Metadata' }).click()

    cy.findAllByText(ANONYMIZED_FIELD_VALUE).should('exist')
  })
})
