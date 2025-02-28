import { useEffect, useState } from 'react'
import { Dataset } from '@/dataset/domain/models/Dataset'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { getDatasetByPersistentId } from '@/dataset/domain/useCases/getDatasetByPersistentId'

interface UseGetDatasetProps {
  datasetRepository: DatasetRepository
  persistentId: string
  version?: string
}

interface UseGetDatasetReturnType {
  dataset: Dataset | null
  isLoadingDataset: boolean
  errorLoadingDataset: string | null
}

export const useGetDataset = ({
  datasetRepository,
  persistentId,
  version
}: UseGetDatasetProps): UseGetDatasetReturnType => {
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [isLoadingDataset, setIsLoadingDataset] = useState<boolean>(true)
  const [errorLoadingDataset, setErrorLoadingDataset] = useState<string | null>(null)

  useEffect(() => {
    const handleGetDataset = async () => {
      setIsLoadingDataset(true)
      try {
        const datasetResponse: Dataset = (await getDatasetByPersistentId(
          datasetRepository,
          persistentId,
          version,
          undefined,
          true
        )) as Dataset

        setDataset(datasetResponse)
      } catch (err) {
        // TODO:ME - Handle with ReadError
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the dataset. Try again later.'
        setErrorLoadingDataset(errorMessage)
      } finally {
        setIsLoadingDataset(false)
      }
    }

    void handleGetDataset()
  }, [datasetRepository, persistentId, version])

  return { dataset, isLoadingDataset, errorLoadingDataset }
}
