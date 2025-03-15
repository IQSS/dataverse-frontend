import { act, renderHook } from '@testing-library/react'
import { useGetDatasetVersionDiff } from '@/sections/dataset/dataset-versions/view-difference/useGetDatasetVersionDiff'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetVersionDiff } from '@/dataset/domain/models/DatasetVersionDiff'
import { ReadError } from '@iqss/dataverse-client-javascript'
const datasetRepository: DatasetRepository = {} as DatasetRepository

const datasetVersionDiff: DatasetVersionDiff | undefined = {
  oldVersion: {
    versionNumber: '2.0',
    lastUpdatedDate: '2025-03-11T16:22:00Z'
  },
  newVersion: {
    versionNumber: 'DRAFT',
    lastUpdatedDate: '2025-03-13T14:09:03Z'
  },

  metadataChanges: [
    {
      blockName: 'Citation Metadata',
      changed: [
        {
          fieldName: 'Title',
          oldValue: 'testdateset',
          newValue: 'testdsaddsf'
        },
        {
          fieldName: 'Subtitle',
          oldValue: '',
          newValue: 'affd'
        },
        {
          fieldName: 'Description',
          oldValue: 'd',
          newValue: 'dadadf'
        },
        {
          fieldName: 'Related Publication',
          oldValue: '',
          newValue: 'af'
        }
      ]
    }
  ],
  filesRemoved: [
    {
      fileName: 'blob (2)',
      MD5: '53d3d10e00812f7c55e0c9c3935f3769',
      type: 'application/octet-stream',
      fileId: 40,
      description: '',
      isRestricted: false,
      filePath: '',
      tags: [],
      categories: []
    }
  ]
}

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

  it('should return correct error message when a ReadError occurs', async () => {
    const readError = new ReadError('Error message')
    datasetRepository.getVersionDiff = cy.stub().rejects(readError)

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
    expect(result.current.error).to.deep.equal(readError.message)
  })

  it('should return a generic error message for non-ReadError exceptions', async () => {
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
