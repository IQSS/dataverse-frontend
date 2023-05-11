import { createSandbox, SinonSandbox } from 'sinon'
import { DatasetRepository } from '../../../src/dataset/domain/repositories/DatasetRepository'
import { render } from '@testing-library/react'
import { Dataset } from '../../../src/sections/dataset/Dataset'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'
import { LoadingProvider } from '../../../src/sections/loading/LoadingProvider'

describe('Dataset', () => {
  const sandbox: SinonSandbox = createSandbox()
  const testDataset = DatasetMother.create()

  afterEach(() => {
    sandbox.restore()
  })

  test('renders skeleton while loading', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getById = sandbox.stub().resolves(testDataset)

    const { getByTestId, queryByText } = render(
      <LoadingProvider>
        <Dataset datasetRepository={datasetRepository} id={testDataset.id} />
      </LoadingProvider>
    )

    expect(getByTestId('dataset-skeleton')).toBeInTheDocument()
    expect(queryByText(testDataset.title)).toBeNull()
  })

  test('renders page not found when dataset is null', async () => {
    const emptyDataset = DatasetMother.createEmpty()
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getById = sandbox.stub().resolves(emptyDataset)

    const { findByText } = render(
      <LoadingProvider>
        <Dataset datasetRepository={datasetRepository} id="wrong-id" />
      </LoadingProvider>
    )

    const pageNotFound = await findByText('Page Not Found')
    expect(pageNotFound).toBeInTheDocument()
  })

  it('renders the Dataset page title and labels', async () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getById = sandbox.stub().resolves(testDataset)

    const { findByText, getAllByText } = render(
      <LoadingProvider>
        <Dataset datasetRepository={datasetRepository} id={testDataset.id} />
      </LoadingProvider>
    )

    const title = await findByText(testDataset.title)
    expect(title).toBeInTheDocument()

    testDataset.labels.forEach((label) => {
      getAllByText(label.value).forEach((labelElement) => {
        expect(labelElement).toBeInTheDocument()
      })
    })
  })
})
