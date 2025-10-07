import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { useFile } from '@/sections/file/useFile'
import { act, renderHook } from '@testing-library/react'
import { FileMother } from '@tests/component/files/domain/models/FileMother'

const fileRepository: FileRepository = {} as FileRepository
const fileMock = FileMother.create()

describe('useFile', () => {
  it('should return file and loading state', async () => {
    fileRepository.getById = cy.stub().resolves(fileMock)

    const { result } = renderHook(() => useFile(fileRepository, 2, '1.0'))

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      return expect(result.current.file).to.deep.equal(undefined)
    })

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)

      return expect(result.current.file).to.deep.equal(fileMock)
    })
  })

  it('should handle error when repository fails', async () => {
    fileRepository.getById = cy.stub().rejects(new Error('Error message'))

    const { result } = renderHook(() => useFile(fileRepository, 2, '1.0'))

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      return expect(result.current.file).to.deep.equal(undefined)
    })

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)
      return expect(result.current.file).to.deep.equal(undefined)
    })
  })
})
