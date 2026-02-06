import { renderHook, waitFor } from '@testing-library/react'
import { useUploadLimit } from '@/sections/shared/file-uploader/file-upload-input/useUploadLimit'
import * as uploadLimitsUseCase from '@/dataset/domain/useCases/getDatasetUploadLimits'

const DATASET_PERSISTENT_ID = 'doi:10.5072/FK2/8YOKQI'

describe('useUploadLimit', () => {
  let getDatasetUploadLimitsStub: sinon.SinonStub

  beforeEach(() => {
    getDatasetUploadLimitsStub = cy.stub(uploadLimitsUseCase, 'getDatasetUploadLimits')
  })

  afterEach(() => {
    getDatasetUploadLimitsStub.restore()
  })

  it('formats upload limit values when limits are present', async () => {
    getDatasetUploadLimitsStub.resolves({
      numberOfFilesRemaining: 1200,
      storageQuotaRemaining: 1048576
    })

    const { result } = renderHook(() => useUploadLimit(DATASET_PERSISTENT_ID))

    await waitFor(() => {
      expect(result.current.isLoadingUploadLimits).to.equal(false)
      expect(result.current.uploadLimit.maxFilesAvailableToUploadFormatted).to.equal('1,200')
      expect(result.current.uploadLimit.storageQuotaRemainingFormatted).to.equal('1 MB')
    })
  })

  it('returns empty uploadLimit when no limits are present', async () => {
    getDatasetUploadLimitsStub.resolves({})

    const { result } = renderHook(() => useUploadLimit(DATASET_PERSISTENT_ID))

    await waitFor(() => {
      expect(result.current.isLoadingUploadLimits).to.equal(false)
      expect(result.current.uploadLimit).to.deep.equal({})
    })
  })
})
