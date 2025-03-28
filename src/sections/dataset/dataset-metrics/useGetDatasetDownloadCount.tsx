import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { getDatasetDownloadCount } from '@/dataset/domain/useCases/getDatasetDownloadCount'
import { DatasetDownloadCount } from '@/dataset/domain/models/DatasetDownloadCount'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'

interface UseGetDatasetDownloadCountProps {
  datasetRepository: DatasetRepository
  datasetId: number | string
  includeMDC?: boolean
}

interface UseGetDatasetDownloadCountReturn {
  downloadCountIncludingMDC: DatasetDownloadCount | null
  downloadCountNotIncludingMDC: DatasetDownloadCount | null
  isLoadingDownloadCount: boolean
  errorLoadingDownloadCount: string | null
}

export const useGetDatasetDownloadCount = ({
  datasetRepository,
  datasetId,
  includeMDC
}: UseGetDatasetDownloadCountProps): UseGetDatasetDownloadCountReturn => {
  const { t } = useTranslation('dataset')

  const [downloadCountIncludingMDC, setDownloadCountIncludingMDC] =
    useState<DatasetDownloadCount | null>(null)

  const [downloadCountNotIncludingMDC, setDownloadNotCountIncludingMDC] =
    useState<DatasetDownloadCount | null>(null)

  const [isLoadingDownloadCount, setIsLoadingDownloadCount] = useState<boolean>(true)
  const [errorLoadingDownloadCount, setErrorLoadingDownloadCount] = useState<string | null>(null)

  useEffect(() => {
    const handleGetDownloadCount = async () => {
      setIsLoadingDownloadCount(true)

      try {
        const downloadCountIncludingMDC = await getDatasetDownloadCount(
          datasetRepository,
          datasetId,
          true
        )

        const downloadCountNotIncludingMDC = await getDatasetDownloadCount(
          datasetRepository,
          datasetId,
          false
        )

        setDownloadCountIncludingMDC(downloadCountIncludingMDC)
        setDownloadNotCountIncludingMDC(downloadCountNotIncludingMDC)
      } catch (err: ReadError | unknown) {
        if (err instanceof ReadError) {
          const error = new JSDataverseReadErrorHandler(err)
          const formattedError =
            error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()

          setErrorLoadingDownloadCount(formattedError)
        } else {
          setErrorLoadingDownloadCount(t('defaultGetDownloadCountError'))
        }
      } finally {
        setIsLoadingDownloadCount(false)
      }
    }
    void handleGetDownloadCount()
  }, [datasetRepository, datasetId, includeMDC, t])

  return {
    downloadCountIncludingMDC,
    downloadCountNotIncludingMDC,
    isLoadingDownloadCount,
    errorLoadingDownloadCount
  }
}
