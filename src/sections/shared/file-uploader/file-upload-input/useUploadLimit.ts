import { useCallback, useEffect, useState } from 'react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { FileSize, FileSizeUnit } from '@/files/domain/models/FileMetadata'
import { getDatasetUploadLimits } from '@/dataset/domain/useCases/getDatasetUploadLimits'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'

interface UploadLimit {
  maxFilesAvailableToUploadFormatted?: string
  storageQuotaRemainingFormatted?: string
}

export function useUploadLimit(datasetPersistentId: string) {
  const [uploadLimit, setUploadLimit] = useState<UploadLimit>({})
  const [isLoadingUploadLimits, setIsLoadingUploadLimits] = useState<boolean>(true)
  const [errorUploadLimits, setErrorUploadLimits] = useState<string | null>(null)

  const fetchUploadLimits = useCallback(async () => {
    setIsLoadingUploadLimits(true)
    setErrorUploadLimits(null)

    try {
      const limits = await getDatasetUploadLimits(datasetPersistentId)

      if (Object.keys(limits).length === 0) {
        setUploadLimit({})
        return
      }

      setUploadLimit({
        maxFilesAvailableToUploadFormatted:
          limits.numberOfFilesRemaining !== undefined
            ? limits.numberOfFilesRemaining.toLocaleString()
            : undefined,
        storageQuotaRemainingFormatted:
          limits.storageQuotaRemaining !== undefined
            ? new FileSize(limits.storageQuotaRemaining, FileSizeUnit.BYTES).toString()
            : undefined
      })
    } catch (error) {
      setUploadLimit({})
      if (error instanceof ReadError) {
        const readError = new JSDataverseReadErrorHandler(error)
        const formattedError =
          readError.getReasonWithoutStatusCode() ??
          /* istanbul ignore next */ readError.getErrorMessage()
        setErrorUploadLimits(formattedError)
      } else {
        setErrorUploadLimits('Something went wrong getting the upload limits. Try again later.')
      }
    } finally {
      setIsLoadingUploadLimits(false)
    }
  }, [datasetPersistentId])

  useEffect(() => {
    void fetchUploadLimits()
  }, [fetchUploadLimits])

  return {
    uploadLimit,
    isLoadingUploadLimits,
    errorUploadLimits,
    fetchUploadLimits
  }
}
