import { useEffect, useState } from 'react'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { getDatasetVersionDiff } from '@/dataset/domain/useCases/getDatasetVersionDiff'
import { DatasetVersionDiff } from '@/dataset/domain/models/DatasetVersionDiff'

interface UseGetDatasetVersionDiff {
  differences: DatasetVersionDiff | undefined
  error: string | null
  isLoading: boolean
}

interface getDatasetVersionDiffProps {
  datasetRepository: DatasetRepository
  persistentId: string
  oldVersion: string
  newVersion: string
}

export const useGetDatasetVersionDiff = ({
  datasetRepository,
  persistentId,
  oldVersion,
  newVersion
}: getDatasetVersionDiffProps): UseGetDatasetVersionDiff => {
  const [differences, setDifferences] = useState<DatasetVersionDiff>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetDatasetVersionDiff = async () => {
      setIsLoading(true)
      try {
        const response = await getDatasetVersionDiff(
          datasetRepository,
          persistentId,
          oldVersion,
          newVersion == 'DRAFT' ? ':draft' : newVersion
        )
        setDifferences(response)
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'There was an error getting the metadata block info by name'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    void handleGetDatasetVersionDiff()
  }, [datasetRepository, newVersion, oldVersion, persistentId])

  return {
    differences,
    error,
    isLoading
  }
}
