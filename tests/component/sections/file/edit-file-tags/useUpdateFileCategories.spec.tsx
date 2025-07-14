import { renderHook, act } from '@testing-library/react'
import { useUpdateFileCategories } from '@/sections/file/file-action-buttons/edit-file-menu/edit-file-tags/useUpdateFileCategories'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { WriteError } from '@iqss/dataverse-client-javascript'

describe('useUpdateFileCategories', () => {
  let fileRepository: FileRepository
  let onSuccessfulUpdateCategories: () => void

  beforeEach(() => {
    fileRepository = {} as FileRepository
    onSuccessfulUpdateCategories = cy.stub().as('onSuccessfulUpdateCategories')
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() =>
      useUpdateFileCategories({
        fileRepository,
        onSuccessfulUpdateCategories
      })
    )

    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.error).to.deep.equal(null)
    expect(typeof result.current.handleUpdateCategories).to.deep.equal('function')
  })

  it('should successfully update file categories', async () => {
    fileRepository.updateFileCategories = cy.stub().resolves(undefined)

    const { result } = renderHook(() =>
      useUpdateFileCategories({
        fileRepository,
        onSuccessfulUpdateCategories
      })
    )

    await act(async () => {
      await result.current.handleUpdateCategories(123, ['Data', 'Code'], true)
    })

    expect(fileRepository.updateFileCategories).to.have.been.calledWith(123, ['Data', 'Code'], true)
    expect(onSuccessfulUpdateCategories).to.have.been.called
    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.error).to.deep.equal(null)
  })

  describe('Error handling', () => {
    it('should handle WriteError and set formatted error message', async () => {
      const mockWriteError = new WriteError('Test error')
      fileRepository.updateFileCategories = cy.stub().rejects(mockWriteError)

      const { result } = renderHook(() =>
        useUpdateFileCategories({
          fileRepository,
          onSuccessfulUpdateCategories
        })
      )

      await act(async () => {
        await result.current.handleUpdateCategories(123, ['Data'], true)
      })

      expect(fileRepository.updateFileCategories).to.have.been.calledWith(123, ['Data'], true)
      expect(onSuccessfulUpdateCategories).to.not.have.been.called
      expect(result.current.isLoading).to.deep.equal(false)
      expect(result.current.error).to.deep.equal('Test error')
    })

    it('should handle unknown errors and set default error message', async () => {
      const unknownError = new Error('Unknown error')
      fileRepository.updateFileCategories = cy.stub().rejects(unknownError)

      const { result } = renderHook(() =>
        useUpdateFileCategories({
          fileRepository,
          onSuccessfulUpdateCategories
        })
      )

      await act(async () => {
        await result.current.handleUpdateCategories(123, ['Data'], true)
      })

      expect(fileRepository.updateFileCategories).to.have.been.calledWith(123, ['Data'], true)
      expect(onSuccessfulUpdateCategories).to.not.have.been.called
      expect(result.current.isLoading).to.deep.equal(false)
      expect(result.current.error).to.deep.equal(
        'Something went wrong updating the file. Try again later.'
      )
    })
  })
})
