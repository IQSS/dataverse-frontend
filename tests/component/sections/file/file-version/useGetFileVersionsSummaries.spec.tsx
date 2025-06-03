import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FileMother } from '../../../files/domain/models/FileMother'
import { useGetFileVersionsSummaries } from '@/sections/file/file-version/useGetFileVersionsSummaries'
import { act, renderHook } from '@testing-library/react'
import { ReadError } from '@iqss/dataverse-client-javascript'

const fileVersionSummaries = FileMother.createFileVersionSummary()
const fileRepository: FileRepository = {} as FileRepository

describe('useGetFileVersionsSummaries', () => {
  it('should return file version summaries correctly', async () => {
    fileRepository.getFileVersionSummaries = cy.stub().resolves(fileVersionSummaries)
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
    fileRepository.getFileVersionSummaries = cy.stub().resolves(fileVersionSummaries)
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
    fileRepository.getFileVersionSummaries = cy.stub().resolves(fileVersionSummaries)
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
})
