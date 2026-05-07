import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FileMother } from '../../../files/domain/models/FileMother'
import { useGetFileVersionsSummaries } from '@/sections/file/file-version/useGetFileVersionsSummaries'
import { act, renderHook } from '@testing-library/react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { FileVersionPaginationInfo } from '@/files/domain/models/FileVersionPaginationInfo'

const fileVersionSummaries = FileMother.createFileVersionSummary()
const fileVersionSummariesSubset = {
  summaries: fileVersionSummaries,
  totalCount: fileVersionSummaries.length
}
const fileRepository: FileRepository = {} as FileRepository

describe('useGetFileVersionsSummaries', () => {
  it('should return file version summaries correctly', async () => {
    fileRepository.getFileVersionSummaries = cy.stub().resolves(fileVersionSummariesSubset)
    const { result } = renderHook(() =>
      useGetFileVersionsSummaries({
        fileRepository,
        fileId: 1,
        autoFetch: true
      })
    )

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      expect(result.current.error).to.deep.equal(null)
      return expect(result.current.fileVersionSummaries).to.deep.equal(undefined)
    })

    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.fileVersionSummaries).to.deep.equal(fileVersionSummaries)
  })

  it('should return correct error message when a ReadError occurs', async () => {
    const error = new ReadError('Error message')
    fileRepository.getFileVersionSummaries = cy.stub().rejects(error)

    const { result } = renderHook(() =>
      useGetFileVersionsSummaries({
        fileRepository,
        fileId: 1,
        autoFetch: true
      })
    )
    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      expect(result.current.error).to.deep.equal(null)
      return expect(result.current.fileVersionSummaries).to.deep.equal(undefined)
    })

    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.error).to.deep.equal(error.message)
  })

  it('should return a generic error message for non-Error exceptions', async () => {
    fileRepository.getFileVersionSummaries = cy.stub().rejects('Unexpected error')

    const { result } = renderHook(() =>
      useGetFileVersionsSummaries({
        fileRepository,
        fileId: 1,
        autoFetch: true
      })
    )

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      expect(result.current.error).to.deep.equal(null)
      return expect(result.current.fileVersionSummaries).to.deep.equal(undefined)
    })

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)
      return expect(result.current.error).to.deep.equal(
        'Something went wrong getting the information from the file versions summaries. Try again later.'
      )
    })
  })

  it('should not fetch data if autoFetch is false', async () => {
    fileRepository.getFileVersionSummaries = cy.stub().resolves(fileVersionSummariesSubset)
    const { result } = renderHook(() =>
      useGetFileVersionsSummaries({
        fileRepository,
        fileId: 1,
        autoFetch: false
      })
    )

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)
      expect(result.current.error).to.deep.equal(null)
      expect(result.current.fileVersionSummaries).to.deep.equal(undefined)
      return expect(fileRepository.getFileVersionSummaries).not.to.have.been.called
    })

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)
      expect(result.current.error).to.deep.equal(null)
      expect(result.current.fileVersionSummaries).to.deep.equal(undefined)
      return expect(fileRepository.getFileVersionSummaries).not.to.have.been.called
    })
  })

  it('should fetch data when refetch is called', () => {
    fileRepository.getFileVersionSummaries = cy.stub().resolves(fileVersionSummariesSubset)
    const { result } = renderHook(() =>
      useGetFileVersionsSummaries({
        fileRepository,
        fileId: 1,
        autoFetch: false
      })
    )

    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.fileVersionSummaries).to.deep.equal(undefined)
    expect(result.current.error).to.deep.equal(null)

    act(() => {
      return void result.current.fetchSummaries()
    })

    cy.wrap(null).should(() => {
      expect(result.current.isLoading).to.deep.equal(true)
    })

    cy.wrap(null).should(() => {
      expect(result.current.isLoading).to.deep.equal(false)
      expect(result.current.fileVersionSummaries).to.deep.equal(fileVersionSummaries)
      expect(fileRepository.getFileVersionSummaries).to.have.been.calledWith(1)
    })
  })

  it('should fetch data with pagination info and return the total count', () => {
    const paginationInfo = new FileVersionPaginationInfo(2, 10, 11)
    fileRepository.getFileVersionSummaries = cy.stub().resolves(fileVersionSummariesSubset)
    const { result } = renderHook(() =>
      useGetFileVersionsSummaries({
        fileRepository,
        fileId: 1,
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
      expect(result.current.isLoading).to.deep.equal(false)
      expect(fileRepository.getFileVersionSummaries).to.have.been.calledWith(1, paginationInfo)
      expect(totalCount).to.deep.equal(fileVersionSummariesSubset.totalCount)
    })
  })

  it('does not fetch by default when autoFetch is omitted', () => {
    fileRepository.getFileVersionSummaries = cy.stub().resolves(fileVersionSummariesSubset)
    const { result } = renderHook(() => useGetFileVersionsSummaries({ fileRepository, fileId: 1 }))
    expect(result.current.isLoading).to.equal(false)
    expect(fileRepository.getFileVersionSummaries).not.to.have.been.called
  })

  it('discards a stale fetchSummaries result when a newer request is in flight', async () => {
    let resolveFirst!: (v: typeof fileVersionSummariesSubset) => void
    const firstPromise = new Promise<typeof fileVersionSummariesSubset>((r) => {
      resolveFirst = r
    })
    const newer = {
      summaries: FileMother.createFileVersionSummary(),
      totalCount: 99
    }
    const stub = cy.stub()
    stub.onFirstCall().returns(firstPromise)
    stub.onSecondCall().resolves(newer)
    fileRepository.getFileVersionSummaries = stub

    const { result } = renderHook(() => useGetFileVersionsSummaries({ fileRepository, fileId: 1 }))

    let firstResolved: number | undefined = -1
    let secondResolved: number | undefined = -1
    await act(async () => {
      const p1 = result.current.fetchSummaries()
      const p2 = result.current.fetchSummaries()
      resolveFirst(fileVersionSummariesSubset)
      ;[firstResolved, secondResolved] = await Promise.all([p1, p2])
    })

    expect(firstResolved).to.equal(undefined)
    expect(secondResolved).to.equal(99)
    expect(result.current.fileVersionSummaries).to.deep.equal(newer.summaries)
  })

  it('discards a stale fetchSummaries error when a newer request is in flight', async () => {
    let rejectFirst!: (err: Error) => void
    const firstPromise = new Promise<typeof fileVersionSummariesSubset>((_res, rej) => {
      rejectFirst = rej
    })
    const newer = {
      summaries: FileMother.createFileVersionSummary(),
      totalCount: 99
    }
    const stub = cy.stub()
    stub.onFirstCall().returns(firstPromise)
    stub.onSecondCall().resolves(newer)
    fileRepository.getFileVersionSummaries = stub

    const { result } = renderHook(() => useGetFileVersionsSummaries({ fileRepository, fileId: 1 }))

    let firstResolved: number | undefined = -1
    await act(async () => {
      const p1 = result.current.fetchSummaries()
      const p2 = result.current.fetchSummaries()
      rejectFirst(new Error('stale boom'))
      firstResolved = await p1
      await p2
    })

    expect(firstResolved).to.equal(undefined)
    expect(result.current.error).to.equal(null)
    expect(result.current.fileVersionSummaries).to.deep.equal(newer.summaries)
  })
})
