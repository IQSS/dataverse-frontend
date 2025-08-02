import { useState, useEffect } from 'react'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { getDatasetAvailableCategories } from '@/dataset/domain/useCases/getDatasetAvailableCategories'

export interface UseGetAvailableCategories {
  datasetRepository: DatasetRepository
  datasetId: number | string
}

export const useGetAvailableCategories = ({
  datasetRepository,
  datasetId
}: UseGetAvailableCategories) => {
  const [availableCategories, setAvailableCategories] = useState<string[]>([
    'Documentation',
    'Code',
    'Data'
  ])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const HandleGetAvailableCategories = async (datasetId: number | string) => {
      try {
        const categories: string[] = await getDatasetAvailableCategories(
          datasetRepository,
          datasetId
        )

        setAvailableCategories(categories)
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong fetching available categories. Try again later.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    void HandleGetAvailableCategories(datasetId)
  }, [datasetRepository, datasetId])

  return { availableCategories, isLoading, error }
}
