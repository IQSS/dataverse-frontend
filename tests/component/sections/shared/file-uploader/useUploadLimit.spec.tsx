import { act, renderHook, waitFor } from '@testing-library/react'
import { useUploadLimit } from '@/sections/shared/file-uploader/file-upload-input/useUploadLimit'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'

const DATASET_PERSISTENT_ID = 'doi:10.5072/FK2/8YOKQI'
const datasetRepository: DatasetRepository = {} as DatasetRepository

describe('useUploadLimit', () => {
  it('formats upload limit values when limits are present', async () => {
    const fetchUploadLimits = cy.stub().resolves({
      numberOfFilesRemaining: 1200,
      storageQuotaRemaining: 1048576
    })

    const { result } = renderHook(() =>
      useUploadLimit(DATASET_PERSISTENT_ID, datasetRepository, fetchUploadLimits)
    )

    await act(() => {
      expect(result.current.isLoadingUploadLimits).to.deep.equal(true)
      return expect(result.current.uploadLimit).to.deep.equal({})
    })

    await act(() => {
      expect(result.current.isLoadingUploadLimits).to.deep.equal(false)

      return expect(result.current.uploadLimit).to.deep.equal({
        maxFilesAvailableToUploadFormatted: '1,200',
        storageQuotaRemainingFormatted: '1 MB'
      })
    })
  })

  it('returns empty uploadLimit when no limits are present', async () => {
    const fetchUploadLimits = cy.stub().resolves({})

    const { result } = renderHook(() =>
      useUploadLimit(DATASET_PERSISTENT_ID, datasetRepository, fetchUploadLimits)
    )

    await waitFor(() => {
      expect(result.current.isLoadingUploadLimits).to.equal(false)
      expect(result.current.uploadLimit).to.deep.equal({})
    })
  })
})
