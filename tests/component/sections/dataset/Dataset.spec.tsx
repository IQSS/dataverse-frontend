import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../../../src/sections/dataset/Dataset'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'
import { LoadingProvider } from '../../../../src/sections/loading/LoadingProvider'
import { useLoading } from '../../../../src/sections/loading/LoadingContext'
import { ANONYMIZED_FIELD_VALUE } from '../../../../src/dataset/domain/models/Dataset'
import { AnonymizedContext } from '../../../../src/sections/dataset/anonymized/AnonymizedContext'
import { FileRepository } from '../../../../src/files/domain/repositories/FileRepository'
import { Dataset as DatasetModel } from '../../../../src/dataset/domain/models/Dataset'
import { ReactNode } from 'react'
import { DatasetProvider } from '../../../../src/sections/dataset/DatasetProvider'

const setAnonymizedView = () => {}
const fileRepository: FileRepository = {} as FileRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository
describe('Dataset', () => {
  const mountWithDataset = (
    component: ReactNode,
    dataset: DatasetModel | undefined,
    anonymizedView = false
  ) => {
    const searchParams = anonymizedView
      ? { privateUrlToken: 'some-private-url-token' }
      : { persistentId: 'some-persistent-id', version: 'some-version' }
    datasetRepository.getByPersistentId = cy.stub().resolves(dataset)
    datasetRepository.getByPrivateUrlToken = cy.stub().resolves(dataset)

    cy.customMount(
      <LoadingProvider>
        <AnonymizedContext.Provider value={{ anonymizedView: anonymizedView, setAnonymizedView }}>
          <DatasetProvider repository={datasetRepository} searchParams={searchParams}>
            {component}
          </DatasetProvider>
        </AnonymizedContext.Provider>
      </LoadingProvider>
    )
  }

  it('renders skeleton while loading', () => {
    const testDataset = DatasetMother.create()

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

    mountWithDataset(
      <>
        <Dataset fileRepository={fileRepository} />
        <TestComponent />
      </>,
      testDataset
    )

    cy.findByText(buttonText).click()

    cy.findByTestId('dataset-skeleton').should('exist')
    cy.findByText(testDataset.getTitle()).should('not.exist')
  })

  it('renders page not found when dataset is null', () => {
    const emptyDataset = DatasetMother.createEmpty()

    mountWithDataset(<Dataset fileRepository={fileRepository} />, emptyDataset)

    cy.findByText('Page Not Found').should('exist')
  })

  it('renders the Dataset page title and labels', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<Dataset fileRepository={fileRepository} />, testDataset)

    cy.findAllByText(testDataset.getTitle()).should('exist')

    testDataset.labels.forEach((label) => {
      cy.findAllByText(label.value).should('exist')
    })
  })

  it('renders the Dataset Metadata tab', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<Dataset fileRepository={fileRepository} />, testDataset)

    cy.findAllByText(testDataset.getTitle()).should('exist')

    const metadataTab = cy.findByRole('tab', { name: 'Metadata' })
    metadataTab.should('exist')

    metadataTab.click()

    cy.findByText('Citation Metadata').should('exist')
  })

  it('renders the Dataset in anonymized view', () => {
    const testDatasetAnonymized = DatasetMother.createAnonymized()

    mountWithDataset(<Dataset fileRepository={fileRepository} />, testDatasetAnonymized)

    cy.findByRole('tab', { name: 'Metadata' }).click()

    cy.findAllByText(ANONYMIZED_FIELD_VALUE).should('exist')
  })

  it('renders the Dataset Action Buttons', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<Dataset fileRepository={fileRepository} />, testDataset)

    cy.findByRole('group', { name: 'Dataset Action Buttons' }).should('exist')
  })
})
