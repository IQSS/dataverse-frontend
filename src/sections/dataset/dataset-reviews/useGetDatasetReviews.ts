import { useEffect, useState } from 'react'
import { DatasetReview } from '@/dataset/domain/models/DatasetReview'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { getDatasetReviews } from '@/dataset/domain/useCases/getDatasetReviews'

interface UseGetDatasetReviewsProps {
  datasetRepository: DatasetRepository
  datasetId: string | number
}

interface UseGetDatasetReviewsReturn {
  datasetReviews: DatasetReview[]
  isLoading: boolean
  error: string | null
}

export const useGetDatasetReviews = ({
  datasetRepository,
  datasetId
}: UseGetDatasetReviewsProps): UseGetDatasetReviewsReturn => {
  const [datasetReviews, setDatasetReviews] = useState<DatasetReview[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetDatasetReviews = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const reviews = await getDatasetReviews(datasetRepository, datasetId)
        setDatasetReviews(reviews)
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the dataset reviews. Try again later.'
        setError(errorMessage)
        setDatasetReviews([])
      } finally {
        setIsLoading(false)
      }
    }

    void handleGetDatasetReviews()
  }, [datasetRepository, datasetId])

  return {
    datasetReviews,
    isLoading,
    error
  }
}
