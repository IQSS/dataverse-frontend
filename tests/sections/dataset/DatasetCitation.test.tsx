import { render } from '@testing-library/react'
import { DatasetCitation } from '../../../src/sections/dataset/datasetCitation/DatasetCitation'
import { createSandbox, SinonSandbox } from 'sinon'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'
import { DatasetRepository } from '../../../src/dataset/domain/repositories/DatasetRepository'

describe('DatasetCitation component', () => {
  const sandbox: SinonSandbox = createSandbox()
  const testDataset = DatasetMother.create()
  afterEach(() => {
    sandbox.restore()
  })
  it('renders citation information', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getById = sandbox.stub().resolves(testDataset)

    const { getByText, getByRole } = render(
      <DatasetCitation datasetRepository={datasetRepository} id={testDataset.id} />
    )
    const expectedText =
      /K, Ellen, 2023, "Test Terms", https:\/\/doi\.org\/10\.70122\/FK2\/KLX4XO, Demo Dataverse, V1/
    // const element = getByText(expectedText)
    // expect(element).toBeInTheDocument()
    //  expect(getByText(testDataset.displayCitation)).toBeInTheDocument()
    expect(getByText('Dropdown Citation')).toBeInTheDocument()
    expect(getByText('Learn about Data Citation Standards.')).toBeInTheDocument()
    expect(getByRole('link', { name: 'Data Citation Standards.' })).toHaveAttribute(
      'href',
      'https://dataverse.org'
    )
    expect(getByRole('article')).toBeInTheDocument()
  })

  it('does not render anything when dataset is not available', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getById = sandbox.stub().resolves(testDataset)

    const id = 'invalid-id'

    const { queryByRole } = render(
      <DatasetCitation datasetRepository={datasetRepository} id={id} />
    )

    expect(queryByRole('article')).not.toBeInTheDocument()
  })
})
