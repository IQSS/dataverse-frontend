import { useCallback, useEffect, useMemo, useState } from 'react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { FileSize, FileSizeUnit } from '@/files/domain/models/FileMetadata'
import { getDatasetUploadLimits } from '@/dataset/domain/useCases/getDatasetUploadLimits'
import { DatasetUploadLimits } from '@/dataset/domain/models/DatasetUploadLimits'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'

interface UploadLimit {
  maxFilesAvailableToUploadFormatted?: string
  storageQuotaRemainingFormatted?: string
}

const defaultDatasetRepository = new DatasetJSDataverseRepository()

export function useUploadLimit(
  datasetPersistentId: string,
  fetchUploadLimits?: (datasetId: string | number) => Promise<DatasetUploadLimits>
) {
  const [uploadLimit, setUploadLimit] = useState<UploadLimit>({})
  const [isLoadingUploadLimits, setIsLoadingUploadLimits] = useState<boolean>(true)
  const [errorUploadLimits, setErrorUploadLimits] = useState<string | null>(null)

  const fetcher = useMemo<(datasetId: string | number) => Promise<DatasetUploadLimits>>(
    () =>
      fetchUploadLimits ??
      ((datasetId) => getDatasetUploadLimits(datasetId, defaultDatasetRepository)),
    [fetchUploadLimits]
  )

  const fetchUploadLimitsCallback = useCallback(async () => {
    setIsLoadingUploadLimits(true)
    setErrorUploadLimits(null)

    try {
      const limits = await fetcher(datasetPersistentId)

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
  }, [datasetPersistentId, fetcher])

  useEffect(() => {
    void fetchUploadLimitsCallback()
  }, [fetchUploadLimitsCallback])

  return {
    uploadLimit,
    isLoadingUploadLimits,
    errorUploadLimits,
    fetchUploadLimits: fetchUploadLimitsCallback
  }
}
