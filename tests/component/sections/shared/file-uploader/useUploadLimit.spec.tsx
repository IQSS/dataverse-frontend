import { act, renderHook, waitFor } from '@testing-library/react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { useUploadLimit } from '@/sections/shared/file-uploader/file-upload-input/useUploadLimit'

const DATASET_PERSISTENT_ID = 'doi:10.5072/FK2/8YOKQI'

describe('useUploadLimit', () => {
  it('formats upload limit values when limits are present', async () => {
    const fetchUploadLimits = cy.stub().resolves({
      numberOfFilesRemaining: 1200,
      storageQuotaRemaining: 1048576
    })

    const { result } = renderHook(() => useUploadLimit(DATASET_PERSISTENT_ID, fetchUploadLimits))

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

    const { result } = renderHook(() => useUploadLimit(DATASET_PERSISTENT_ID, fetchUploadLimits))

    await waitFor(() => {
      expect(result.current.isLoadingUploadLimits).to.equal(false)
      expect(result.current.uploadLimit).to.deep.equal({})
    })
  })

  describe('Error handling', () => {
    it('returns the ReadError message when upload limits fetch fails with ReadError', async () => {
      const fetchUploadLimits = cy.stub().rejects(new ReadError('Error message'))

      const { result } = renderHook(() => useUploadLimit(DATASET_PERSISTENT_ID, fetchUploadLimits))

      await act(() => {
        expect(result.current.isLoadingUploadLimits).to.deep.equal(true)
        return expect(result.current.errorUploadLimits).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoadingUploadLimits).to.deep.equal(false)
        expect(result.current.uploadLimit).to.deep.equal({})
        return expect(result.current.errorUploadLimits).to.deep.equal('Error message')
      })
    })

    it('returns the default error message when upload limits fetch fails with a non-ReadError', async () => {
      const fetchUploadLimits = cy.stub().rejects('Error message')

      const { result } = renderHook(() => useUploadLimit(DATASET_PERSISTENT_ID, fetchUploadLimits))

      await act(() => {
        expect(result.current.isLoadingUploadLimits).to.deep.equal(true)
        return expect(result.current.errorUploadLimits).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoadingUploadLimits).to.deep.equal(false)
        expect(result.current.uploadLimit).to.deep.equal({})
        return expect(result.current.errorUploadLimits).to.deep.equal(
          'Something went wrong getting the upload limits. Try again later.'
        )
      })
    })
  })
})
