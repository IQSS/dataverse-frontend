import { useCallback, useEffect, useState } from 'react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'
import { DatasetRepository } from '../repositories/DatasetRepository'
import { getAvailableDatasetTypes } from '../useCases/getAvailableDatasetTypes'
import { DatasetType } from '../models/DatasetType'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'

interface useGetAvailableDatasetTypesProps {
  datasetRepository: DatasetRepository
  collectionRepository?: CollectionRepository
  collectionId?: string
  autoFetch?: boolean
}

export const useGetAvailableDatasetTypes = ({
  datasetRepository,
  collectionRepository,
  collectionId,
  autoFetch = true
}: useGetAvailableDatasetTypesProps) => {
  const [datasetTypes, setDatasetTypes] = useState<DatasetType[]>([])
  const [isLoadingDatasetTypes, setIsLoadingDatasetTypes] = useState<boolean>(autoFetch)
  const [errorGetDatasetTypes, setErrorGetDatasetTypes] = useState<string | null>(null)

  const fetchDatasetTypes = useCallback(async () => {
    setIsLoadingDatasetTypes(true)
    setErrorGetDatasetTypes(null)

    try {
      const response =
        collectionRepository && collectionId
          ? (await collectionRepository.getById(collectionId)).allowedDatasetTypes ?? []
          : await getAvailableDatasetTypes(datasetRepository)

      setDatasetTypes(response)

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
  }, [datasetRepository, collectionRepository, collectionId])

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
