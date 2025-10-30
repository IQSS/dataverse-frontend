import { useCallback, useEffect, useState } from 'react'
import { DatasetVersionSummaryInfo } from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { getDatasetVersionsSummaries } from '@/dataset/domain/useCases/getDatasetVersionsSummaries'

interface UseGetDatasetVersionsSummaries {
  datasetVersionSummaries: DatasetVersionSummaryInfo[] | undefined
  error: string | null
  isLoading: boolean
  fetchSummaries: (limit?: number, offset?: number) => Promise<void>
}

interface Props {
  datasetRepository: DatasetRepository
  persistentId: string
  autoFetch?: boolean
}

export const useGetDatasetVersionsSummaries = ({
  datasetRepository,
  persistentId,
  autoFetch = false
}: Props): UseGetDatasetVersionsSummaries => {
  const [summaries, setSummaries] = useState<DatasetVersionSummaryInfo[]>()
  const [isLoading, setIsLoading] = useState<boolean>(autoFetch)
  const [error, setError] = useState<string | null>(null)

  const fetchSummaries = useCallback(
    async (limit?: number, offset?: number) => {
      setIsLoading(true)
      setError(null)

      try {
        const versionSummaries = await getDatasetVersionsSummaries(
          datasetRepository,
          persistentId,
          limit,
          offset
        )
        setSummaries(versionSummaries.summaries)
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the information from the dataset versions summaries. Try again later.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [datasetRepository, persistentId]
  )

  useEffect(() => {
    if (autoFetch) {
      void fetchSummaries()
    }
  }, [autoFetch, fetchSummaries])

  return {
    datasetVersionSummaries: summaries,
    error,
    isLoading,
    fetchSummaries
  }
}
