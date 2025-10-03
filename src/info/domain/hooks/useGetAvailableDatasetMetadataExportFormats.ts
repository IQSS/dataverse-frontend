import { useCallback, useEffect, useState } from 'react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { DataverseInfoRepository } from '../repositories/DataverseInfoRepository'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'
import { getAvailableDatasetMetadataExportFormats } from '../useCases/getAvailableDatasetMetadataExportFormats'
import { DatasetMetadataExportFormats } from '../models/DatasetMetadataExportFormats'

interface useGetAvailableDatasetMetadataExportFormatsProps {
  dataverseInfoRepository: DataverseInfoRepository
  autoFetch?: boolean
}

export const useGetAvailableDatasetMetadataExportFormats = ({
  dataverseInfoRepository,
  autoFetch = true
}: useGetAvailableDatasetMetadataExportFormatsProps) => {
  const [datasetMetadataExportFormats, setDatasetMetadataExportFormats] =
    useState<DatasetMetadataExportFormats | null>(null)
  const [isLoadingExportFormats, setIsLoadingExportFormats] = useState<boolean>(autoFetch)
  const [errorGetExportFormats, setErrorGetExportFormats] = useState<string | null>(null)

  const fetchDatasetMetadataExportFormats = useCallback(async () => {
    setIsLoadingExportFormats(true)
    setErrorGetExportFormats(null)

    try {
      const exportFormatsResponse = await getAvailableDatasetMetadataExportFormats(
        dataverseInfoRepository
      )

      setDatasetMetadataExportFormats(exportFormatsResponse)
    } catch (err) {
      if (err instanceof ReadError) {
        const error = new JSDataverseReadErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()

        setErrorGetExportFormats(formattedError)
      } else {
        setErrorGetExportFormats(
          'Something went wrong getting the dataset export formats. Try again later.'
        )
      }
    } finally {
      setIsLoadingExportFormats(false)
    }
  }, [dataverseInfoRepository])

  useEffect(() => {
    if (autoFetch) {
      void fetchDatasetMetadataExportFormats()
    }
  }, [autoFetch, fetchDatasetMetadataExportFormats])

  return {
    datasetMetadataExportFormats,
    isLoadingExportFormats,
    errorGetExportFormats,
    fetchDatasetMetadataExportFormats
  }
}
