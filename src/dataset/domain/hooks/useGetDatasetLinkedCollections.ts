import { useCallback, useEffect, useState } from 'react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'
import { CollectionSummary } from '@/collection/domain/models/CollectionSummary'
import { DatasetRepository } from '../repositories/DatasetRepository'
import { getDatasetLinkedCollections } from '../useCases/getDatasetLinkedCollections'

interface useGetDatasetLinkedCollectionsProps {
  datasetRepository: DatasetRepository
  datasetId: string | number
  autoFetch?: boolean
}

export const useGetDatasetLinkedCollections = ({
  datasetRepository,
  datasetId,
  autoFetch = true
}: useGetDatasetLinkedCollectionsProps) => {
  const [datasetLinkedCollections, setDatasetLinkedCollections] = useState<CollectionSummary[]>([])
  const [isLoadingDatasetLinkedCollections, setIsLoadingDatasetLinkedCollections] =
    useState<boolean>(autoFetch)
  const [errorGetDatasetLinkedCollections, setErrorGetDatasetLinkedCollections] = useState<
    string | null
  >(null)

  const fetchDatasetLinkedCollections = useCallback(async () => {
    setIsLoadingDatasetLinkedCollections(true)
    setErrorGetDatasetLinkedCollections(null)

    try {
      const linkedCollections = await getDatasetLinkedCollections(datasetRepository, datasetId)

      setDatasetLinkedCollections(linkedCollections)
    } catch (err) {
      if (err instanceof ReadError) {
        const error = new JSDataverseReadErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()

        setErrorGetDatasetLinkedCollections(formattedError)
      } else {
        setErrorGetDatasetLinkedCollections(
          'Something went wrong getting the dataset linked collections. Try again later.'
        )
      }
    } finally {
      setIsLoadingDatasetLinkedCollections(false)
    }
  }, [datasetRepository, datasetId])

  useEffect(() => {
    if (autoFetch) {
      void fetchDatasetLinkedCollections()
    }
  }, [autoFetch, fetchDatasetLinkedCollections])

  return {
    datasetLinkedCollections,
    isLoadingDatasetLinkedCollections,
    errorGetDatasetLinkedCollections,
    fetchDatasetLinkedCollections
  }
}
