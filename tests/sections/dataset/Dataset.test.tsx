import { createSandbox, SinonSandbox } from 'sinon'
import { DatasetRepository } from '../../../src/dataset/domain/repositories/DatasetRepository'
import { render } from '@testing-library/react'
import { Dataset } from '../../../src/sections/dataset/Dataset'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'

describe('Dataset', () => {
  const sandbox: SinonSandbox = createSandbox()
  const testDataset = DatasetMother.create()

  afterEach(() => {
    sandbox.restore()
  })

  it('renders the Dataset page title and labels', async () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getById = sandbox.stub().resolves(testDataset)

    const { findByText, getByText } = render(
      <Dataset datasetRepository={datasetRepository} id={testDataset.id} />
    )

    const title = await findByText(testDataset.title)
    expect(title).toBeInTheDocument()

    testDataset.labels.forEach((label) => {
      expect(getByText(label.value)).toBeInTheDocument()
    })
  })
})
