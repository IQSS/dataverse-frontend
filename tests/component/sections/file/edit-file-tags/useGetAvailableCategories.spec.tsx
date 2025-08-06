import { act, renderHook } from '@testing-library/react'
import { useGetAvailableCategories } from '@/sections/file/file-action-buttons/edit-file-menu/edit-file-tags/edit-file-tags-modal/useGetAvailableCategories'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'

describe('useGetAvailableCategories', () => {
  let datasetRepository: DatasetRepository

  beforeEach(() => {
    datasetRepository = {} as DatasetRepository
  })

  it('should successfully get dataset available categories', async () => {
    const categoriesMock = ['Documentation', 'Code', 'Data', 'Category4']
    const defaultCategories = ['Documentation', 'Code', 'Data']
    datasetRepository.getAvailableCategories = cy.stub().resolves(categoriesMock)

    const { result } = renderHook(() =>
      useGetAvailableCategories({
        datasetRepository,
        datasetId: 123
      })
    )
    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      return expect(result.current.availableCategories).to.deep.equal(defaultCategories)
    })

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)

      return expect(result.current.availableCategories).to.deep.equal(categoriesMock)
    })
    expect(datasetRepository.getAvailableCategories).to.have.been.calledWith(123)
  })

  describe('Error handling', () => {
    it('should handle WriteError and set formatted error message', async () => {
      const mockReadError = new ReadError('Test error')
      datasetRepository.getAvailableCategories = cy.stub().rejects(mockReadError)

      const { result } = renderHook(() =>
        useGetAvailableCategories({
          datasetRepository,
          datasetId: 123
        })
      )

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(true)
        return expect(result.current.error).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(false)
        return expect(result.current.error).to.deep.equal(
          'There was an error when reading the resource. Reason was: Test error'
        )
      })
    })

    it('should handle unknown errors and set default error message', async () => {
      datasetRepository.getAvailableCategories = cy.stub().rejects('Error message')

      const { result } = renderHook(() =>
        useGetAvailableCategories({
          datasetRepository,
          datasetId: 123
        })
      )

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(true)
        return expect(result.current.error).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(false)
        return expect(result.current.error).to.deep.equal(
          'Something went wrong fetching available categories. Try again later.'
        )
      })
    })
  })
})
