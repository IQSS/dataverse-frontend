import { renderHook, act } from '@testing-library/react'
import { useUpdateFileTabularTags } from '@/sections/file/file-action-buttons/edit-file-menu/edit-file-tags/useUpdateFileTabularTags'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { WriteError } from '@iqss/dataverse-client-javascript'

describe('useUpdateFileTabularTags', () => {
  let fileRepository: FileRepository
  let onSuccessfulUpdateTabularTags: () => void

  beforeEach(() => {
    fileRepository = {} as FileRepository
    onSuccessfulUpdateTabularTags = cy.stub().as('onSuccessfulUpdateTabularTags')
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() =>
      useUpdateFileTabularTags({
        fileRepository,
        onSuccessfulUpdateTabularTags
      })
    )

    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.error).to.deep.equal(null)
    expect(typeof result.current.handleUpdateTabularTags).to.deep.equal('function')
  })

  it('should successfully update file tabular tags', async () => {
    fileRepository.updateFileTabularTags = cy.stub().resolves(undefined)

    const { result } = renderHook(() =>
      useUpdateFileTabularTags({
        fileRepository,
        onSuccessfulUpdateTabularTags
      })
    )

    await act(async () => {
      await result.current.handleUpdateTabularTags(123, ['Survey', 'Time Series'], true)
    })

    expect(fileRepository.updateFileTabularTags).to.have.been.calledWith(
      123,
      ['Survey', 'Time Series'],
      true
    )
    expect(onSuccessfulUpdateTabularTags).to.have.been.called
    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.error).to.deep.equal(null)
  })

  describe('Error handling', () => {
    it('should handle WriteError and set formatted error message', async () => {
      const mockWriteError = new WriteError('Test error')
      fileRepository.updateFileTabularTags = cy.stub().rejects(mockWriteError)

      const { result } = renderHook(() =>
        useUpdateFileTabularTags({
          fileRepository,
          onSuccessfulUpdateTabularTags
        })
      )

      await act(async () => {
        await result.current.handleUpdateTabularTags(123, ['Survey'], true)
      })

      expect(fileRepository.updateFileTabularTags).to.have.been.calledWith(123, ['Survey'], true)
      expect(onSuccessfulUpdateTabularTags).to.not.have.been.called
      expect(result.current.isLoading).to.deep.equal(false)
      expect(result.current.error).to.deep.equal('Test error')
    })

    it('should handle unknown errors and set default error message', async () => {
      const unknownError = new Error('Unknown error')
      fileRepository.updateFileTabularTags = cy.stub().rejects(unknownError)

      const { result } = renderHook(() =>
        useUpdateFileTabularTags({
          fileRepository,
          onSuccessfulUpdateTabularTags
        })
      )

      await act(async () => {
        await result.current.handleUpdateTabularTags(123, ['Survey'], true)
      })

      expect(fileRepository.updateFileTabularTags).to.have.been.calledWith(123, ['Survey'], true)
      expect(onSuccessfulUpdateTabularTags).to.not.have.been.called
      expect(result.current.isLoading).to.deep.equal(false)
      expect(result.current.error).to.deep.equal(
        'Something went wrong deleting the file. Try again later.'
      )
    })
  })
})
