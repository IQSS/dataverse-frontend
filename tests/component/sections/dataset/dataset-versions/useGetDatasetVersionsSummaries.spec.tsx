import { act, renderHook } from '@testing-library/react'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetVersionSummary } from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { DatasetVersionsSummariesMother } from '@tests/component/dataset/domain/models/DatasetVersionsSummariesMother'
import { useGetDatasetVersionsSummaries } from '@/sections/dataset/dataset-versions/useGetDatasetVersionsSummaries'

const datasetRepository: DatasetRepository = {} as DatasetRepository

const datasetVersionsSummariesMock: DatasetVersionSummary[] =
  DatasetVersionsSummariesMother.create() as unknown as DatasetVersionSummary[]

describe('useGetDatasetVersionDiff', () => {
  it('should return dataset version differences correctly', async () => {
    datasetRepository.getDatasetVersionsSummaries = cy.stub().resolves(datasetVersionsSummariesMock)
    const { result } = renderHook(() =>
      useGetDatasetVersionsSummaries({
        datasetRepository,
        persistentId: 'doi:10.5072/FK2/ABC123',
        autoFetch: true
      })
    )

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      expect(result.current.error).to.deep.equal(null)
      return expect(result.current.datasetVersionSummaries).to.deep.equal(undefined)
    })

    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.datasetVersionSummaries).to.deep.equal(datasetVersionsSummariesMock)
  })

  it('should return correct error message when a ReadError occurs', async () => {
    const error = new ReadError('Error message')
    datasetRepository.getDatasetVersionsSummaries = cy.stub().rejects(error)

    const { result } = renderHook(() =>
      useGetDatasetVersionsSummaries({
        datasetRepository,
        persistentId: 'doi:10.5072/FK2/ABC123',
        autoFetch: true
      })
    )
    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      expect(result.current.error).to.deep.equal(null)
      return expect(result.current.datasetVersionSummaries).to.deep.equal(undefined)
    })

    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.error).to.deep.equal(error.message)
  })

  it('should return a generic error message for non-Error exceptions', async () => {
    datasetRepository.getDatasetVersionsSummaries = cy.stub().rejects('Unexpected error')

    const { result } = renderHook(() =>
      useGetDatasetVersionsSummaries({
        datasetRepository,
        persistentId: 'doi:10.5072/FK2/ABC123',
        autoFetch: true
      })
    )

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      expect(result.current.error).to.deep.equal(null)
      return expect(result.current.datasetVersionSummaries).to.deep.equal(undefined)
    })

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)
      return expect(result.current.error).to.deep.equal(
        'Something went wrong getting the information from the dataset versions summaries. Try again later.'
      )
    })
  })

  it('should fetch summaries when fetchSummaries is called', () => {
    datasetRepository.getDatasetVersionsSummaries = cy.stub().resolves(datasetVersionsSummariesMock)

    const { result } = renderHook(() =>
      useGetDatasetVersionsSummaries({
        datasetRepository,
        persistentId: 'doi:10.5072/FK2/ABC123',
        autoFetch: false
      })
    )

    expect(result.current.isLoading).to.equal(false)
    expect(result.current.datasetVersionSummaries).to.be.undefined
    expect(result.current.error).to.be.null

    act(() => {
      return void result.current.fetchSummaries()
    })

    cy.wrap(null).should(() => {
      expect(result.current.isLoading).to.equal(true)
    })

    cy.wrap(null).should(() => {
      expect(result.current.isLoading).to.equal(false)
      expect(result.current.datasetVersionSummaries).to.deep.equal(datasetVersionsSummariesMock)
      expect(datasetRepository.getDatasetVersionsSummaries).to.have.been.calledOnce
    })
  })

  it('should not fetch summaries if autoFetch is false', async () => {
    datasetRepository.getDatasetVersionsSummaries = cy.stub().resolves(datasetVersionsSummariesMock)

    const { result } = renderHook(() =>
      useGetDatasetVersionsSummaries({
        datasetRepository,
        persistentId: 'doi:10.5072/FK2/ABC123',
        autoFetch: false
      })
    )

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)
      expect(result.current.error).to.deep.equal(null)
      expect(result.current.datasetVersionSummaries).to.deep.equal(undefined)
      return expect(datasetRepository.getDatasetVersionsSummaries).not.to.have.been.called
    })

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)
      expect(result.current.error).to.deep.equal(null)
      expect(result.current.datasetVersionSummaries).to.deep.equal(undefined)
      return expect(datasetRepository.getDatasetVersionsSummaries).not.to.have.been.called
    })
  })
})
