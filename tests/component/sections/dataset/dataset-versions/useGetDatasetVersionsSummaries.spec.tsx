import { act, renderHook } from '@testing-library/react'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { DatasetVersionsSummariesMother } from '@tests/component/dataset/domain/models/DatasetVersionsSummariesMother'
import { useGetDatasetVersionsSummaries } from '@/sections/dataset/dataset-versions/useGetDatasetVersionsSummaries'
import { DatasetVersionPaginationInfo } from '@/dataset/domain/models/DatasetVersionPaginationInfo'

const datasetRepository: DatasetRepository = {} as DatasetRepository

const datasetVersionsSummariesSubsetMock = DatasetVersionsSummariesMother.create()
const datasetVersionsSummariesMock = datasetVersionsSummariesSubsetMock.summaries

describe('useGetDatasetVersionsSummaries', () => {
  it('should return dataset version summaries correctly', async () => {
    datasetRepository.getDatasetVersionsSummaries = cy
      .stub()
      .resolves(datasetVersionsSummariesSubsetMock)
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
    datasetRepository.getDatasetVersionsSummaries = cy
      .stub()
      .resolves(datasetVersionsSummariesSubsetMock)

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

  it('should fetch summaries with pagination info and return the total count', () => {
    const paginationInfo = new DatasetVersionPaginationInfo(2, 10, 11)
    datasetRepository.getDatasetVersionsSummaries = cy
      .stub()
      .resolves(datasetVersionsSummariesSubsetMock)

    const { result } = renderHook(() =>
      useGetDatasetVersionsSummaries({
        datasetRepository,
        persistentId: 'doi:10.5072/FK2/ABC123',
        autoFetch: false
      })
    )

    let totalCount: number | undefined

    act(() => {
      void result.current.fetchSummaries(paginationInfo).then((count) => {
        totalCount = count
      })
    })

    cy.wrap(null).should(() => {
      expect(result.current.isLoading).to.equal(false)
      expect(datasetRepository.getDatasetVersionsSummaries).to.have.been.calledWith(
        'doi:10.5072/FK2/ABC123',
        paginationInfo
      )
      expect(totalCount).to.equal(datasetVersionsSummariesSubsetMock.totalCount)
    })
  })

  it('should not fetch summaries if autoFetch is false', async () => {
    datasetRepository.getDatasetVersionsSummaries = cy
      .stub()
      .resolves(datasetVersionsSummariesSubsetMock)

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

  it('does not fetch by default when autoFetch is omitted', () => {
    // Exercises the destructuring default `autoFetch = false` branch.
    datasetRepository.getDatasetVersionsSummaries = cy
      .stub()
      .resolves(datasetVersionsSummariesSubsetMock)

    const { result } = renderHook(() =>
      useGetDatasetVersionsSummaries({
        datasetRepository,
        persistentId: 'doi:10.5072/FK2/ABC123'
      })
    )

    expect(result.current.isLoading).to.equal(false)
    expect(datasetRepository.getDatasetVersionsSummaries).not.to.have.been.called
  })

  it('discards a stale fetchSummaries result when a newer request is in flight', async () => {
    // Two concurrent fetches: the OLD one resolves AFTER the newer one.
    // The hook must drop the stale result (requestId guard) and keep
    // the newer summaries.
    let resolveFirst!: (v: typeof datasetVersionsSummariesSubsetMock) => void
    const firstPromise = new Promise<typeof datasetVersionsSummariesSubsetMock>((r) => {
      resolveFirst = r
    })
    const newer = DatasetVersionsSummariesMother.create()
    const stub = cy.stub()
    stub.onFirstCall().returns(firstPromise)
    stub.onSecondCall().resolves(newer)
    datasetRepository.getDatasetVersionsSummaries = stub

    const { result } = renderHook(() =>
      useGetDatasetVersionsSummaries({
        datasetRepository,
        persistentId: 'doi:10.5072/FK2/ABC123'
      })
    )

    let firstResolved: number | undefined = -1
    let secondResolved: number | undefined = -1
    await act(async () => {
      const p1 = result.current.fetchSummaries()
      const p2 = result.current.fetchSummaries()
      // Resolve the FIRST fetch AFTER the second has overtaken it.
      resolveFirst(datasetVersionsSummariesSubsetMock)
      ;[firstResolved, secondResolved] = await Promise.all([p1, p2])
    })

    // Stale request returns undefined; live one returns the totalCount.
    expect(firstResolved).to.equal(undefined)
    expect(secondResolved).to.equal(newer.totalCount)
    // State reflects the newer summaries, not the stale ones.
    expect(result.current.datasetVersionSummaries).to.deep.equal(newer.summaries)
  })

  it('discards a stale fetchSummaries error when a newer request is in flight', async () => {
    // Same shape as the success test, but the stale promise rejects.
    // The catch path must also short-circuit instead of stamping the
    // error from a stale request onto current state.
    let rejectFirst!: (err: Error) => void
    const firstPromise = new Promise<typeof datasetVersionsSummariesSubsetMock>((_res, rej) => {
      rejectFirst = rej
    })
    const newer = DatasetVersionsSummariesMother.create()
    const stub = cy.stub()
    stub.onFirstCall().returns(firstPromise)
    stub.onSecondCall().resolves(newer)
    datasetRepository.getDatasetVersionsSummaries = stub

    const { result } = renderHook(() =>
      useGetDatasetVersionsSummaries({
        datasetRepository,
        persistentId: 'doi:10.5072/FK2/ABC123'
      })
    )

    let firstResolved: number | undefined = -1
    await act(async () => {
      const p1 = result.current.fetchSummaries()
      const p2 = result.current.fetchSummaries()
      rejectFirst(new Error('stale boom'))
      firstResolved = await p1
      await p2
    })

    expect(firstResolved).to.equal(undefined)
    // The hook's `error` state is NOT polluted by the stale rejection.
    expect(result.current.error).to.equal(null)
    expect(result.current.datasetVersionSummaries).to.deep.equal(newer.summaries)
  })
})
