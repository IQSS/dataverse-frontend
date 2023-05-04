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

  it('renders the Dataset page title and version', async () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getById = sandbox.stub().resolves(testDataset)

    const { findByText } = render(
      <Dataset datasetRepository={datasetRepository} id={testDataset.id} />
    )

    const title = await findByText(testDataset.title)
    expect(title).toBeInTheDocument()

    const version = await findByText(`Version ${testDataset.version}`)
    expect(version).toBeInTheDocument()
  })
})
