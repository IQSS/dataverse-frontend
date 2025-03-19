import { act, renderHook } from '@testing-library/react'
import { useGetDatasetVersionDiff } from '@/sections/dataset/dataset-versions/view-difference/useGetDatasetVersionDiff'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetVersionDiff } from '@/dataset/domain/models/DatasetVersionDiff'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { DatasetVersionDiffMother } from '../../../dataset/domain/models/DatasetVersionDiffMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository

const datasetVersionDiff: DatasetVersionDiff = DatasetVersionDiffMother.create()

const datasetVersionDiffMock = {
  differences: datasetVersionDiff,
  error: 'There was an error getting the dataset version differences',
  isLoading: false
}

describe('useGetDatasetVersionDiff', () => {
  it('should return dataset version differences correctly', async () => {
    datasetRepository.getVersionDiff = cy.stub().resolves(datasetVersionDiffMock)
    const { result } = renderHook(() =>
      useGetDatasetVersionDiff({
        datasetRepository,
        persistentId: 'doi:10.5072/FK2/ABC123',
        oldVersion: '1.0',
        newVersion: '2.0'
      })
    )

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      return expect(result.current.differences).to.deep.equal(undefined)
    })

    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.differences).to.deep.equal(datasetVersionDiffMock)
  })

  it('should return correct error message when a Error occurs', async () => {
    const error = new ReadError('Error message')
    datasetRepository.getVersionDiff = cy.stub().rejects(error)

    const { result } = renderHook(() =>
      useGetDatasetVersionDiff({
        datasetRepository,
        persistentId: 'doi:10.5072/FK2/ABC123',
        oldVersion: '1.0',
        newVersion: '2.0'
      })
    )
    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      expect(result.current.error).to.deep.equal(null)
      return expect(result.current.differences).to.deep.equal(undefined)
    })

    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.error).to.deep.equal(error.message)
  })

  it('should return a generic error message for non-Error exceptions', async () => {
    datasetRepository.getVersionDiff = cy.stub().rejects('Unexpected error')

    const { result } = renderHook(() =>
      useGetDatasetVersionDiff({
        datasetRepository,
        persistentId: 'doi:10.5072/FK2/ABC123',
        oldVersion: '1.0',
        newVersion: '2.0'
      })
    )

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      expect(result.current.error).to.deep.equal(null)
      return expect(result.current.differences).to.deep.equal(undefined)
    })

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)
      return expect(result.current.error).to.deep.equal(
        'Something went wrong getting the information from the dataset version differences. Try again later.'
      )
    })
  })
})
