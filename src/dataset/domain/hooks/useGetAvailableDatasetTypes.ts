import { useCallback, useEffect, useState } from 'react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'
import { DatasetRepository } from '../repositories/DatasetRepository'
import { getAvailableDatasetTypes } from '../useCases/getAvailableDatasetTypes'
import { DatasetType } from '../models/DatasetType'

interface useGetAvailableDatasetTypesProps {
  datasetRepository: DatasetRepository
  autoFetch?: boolean
}

export const useGetAvailableDatasetTypes = ({
  datasetRepository,
  autoFetch = true
}: useGetAvailableDatasetTypesProps) => {
  const [datasetTypes, setDatasetTypes] = useState<DatasetType[]>([])
  const [isLoadingDatasetTypes, setIsLoadingDatasetTypes] = useState<boolean>(autoFetch)
  const [errorGetDatasetTypes, setErrorGetDatasetTypes] = useState<string | null>(null)

  const fetchDatasetTypes = useCallback(async () => {
    setIsLoadingDatasetTypes(true)
    setErrorGetDatasetTypes(null)

    try {
      const response: DatasetType[] = await getAvailableDatasetTypes(datasetRepository)

      setDatasetTypes(response)
    } catch (err) {
      if (err instanceof ReadError) {
        const error = new JSDataverseReadErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()

        setErrorGetDatasetTypes(formattedError)
      } else {
        setErrorGetDatasetTypes('Something went wrong getting the dataset types. Try again later.')
      }
    } finally {
      setIsLoadingDatasetTypes(false)
    }
  }, [datasetRepository])

  useEffect(() => {
    if (autoFetch) {
      void fetchDatasetTypes()
    }
  }, [autoFetch, fetchDatasetTypes])

  return {
    datasetTypes,
    isLoadingDatasetTypes,
    errorGetDatasetTypes,
    fetchDatasetTypes
  }
}
