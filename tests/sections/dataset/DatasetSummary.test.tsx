import { createSandbox, SinonSandbox } from 'sinon'
import { DatasetRepository } from '../../../src/dataset/domain/repositories/DatasetRepository'
import { render } from '@testing-library/react'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'
import { DatasetSummary } from '../../../src/sections/dataset/datasetSummary/DatasetSummary'

describe('DatasetSummary', () => {
  const sandbox: SinonSandbox = createSandbox()
  const testDataset = DatasetMother.create()

  afterEach(() => {
    sandbox.restore()
  })

  it('renders the DatasetSummary fields', async () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getById = sandbox.stub().resolves(testDataset)

    const { findByText } = render(
      <DatasetSummary datasetRepository={datasetRepository} id={testDataset.id} />
    )

    // const description = await findByText(`${testDataset.description.substring(0, 20)}`)
    // expect(description).toBeInTheDocument()

    const subject = await findByText(`${testDataset.subject}`)
    expect(subject).toBeInTheDocument()
    const keyword = await findByText(`${testDataset.keyword}`)
    expect(keyword).toBeInTheDocument()
  })
})
