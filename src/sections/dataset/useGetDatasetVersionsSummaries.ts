import { useEffect, useState } from 'react'
import { DatasetVersionSummaryInfo } from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { getDatasetVersionsSummaries } from '@/dataset/domain/useCases/getDatasetVersionsSummaries'

interface UseGetDatasetVersionsSummaries {
  datasetVersionSummaries: DatasetVersionSummaryInfo[] | undefined
  error: string | null
  isLoading: boolean
}

interface Props {
  datasetRepository: DatasetRepository
  persistentId: string
}
export const useGetDatasetVersionsSummaries = ({
  datasetRepository,
  persistentId
}: Props): UseGetDatasetVersionsSummaries => {
  const [summaries, setSummaries] = useState<DatasetVersionSummaryInfo[]>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetDatasetVersionsSummaries = async () => {
      setIsLoading(true)
      try {
        const response = await getDatasetVersionsSummaries(datasetRepository, persistentId)

        console.log('GetDatasetVersionsSummaries', response)
        setSummaries(response)
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

    void handleGetDatasetVersionsSummaries()
  }, [datasetRepository, persistentId])

  return {
    datasetVersionSummaries: summaries,
    error,
    isLoading
  }
}
