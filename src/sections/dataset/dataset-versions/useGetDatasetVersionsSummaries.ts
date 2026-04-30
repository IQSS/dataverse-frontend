import { useCallback, useEffect, useRef, useState } from 'react'
import { DatasetVersionSummaryInfo } from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { getDatasetVersionsSummaries } from '@/dataset/domain/useCases/getDatasetVersionsSummaries'
import { DatasetVersionPaginationInfo } from '@/dataset/domain/models/DatasetVersionPaginationInfo'

interface UseGetDatasetVersionsSummaries {
  datasetVersionSummaries: DatasetVersionSummaryInfo[] | undefined
  error: string | null
  isLoading: boolean
  fetchSummaries: (paginationInfo?: DatasetVersionPaginationInfo) => Promise<number | undefined>
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
  const latestRequestId = useRef(0)

  const fetchSummaries = useCallback(
    async (paginationInfo?: DatasetVersionPaginationInfo) => {
      const requestId = latestRequestId.current + 1
      latestRequestId.current = requestId
      setIsLoading(true)
      setError(null)

      try {
        const versionSummaries = await getDatasetVersionsSummaries(
          datasetRepository,
          persistentId,
          paginationInfo
        )
        if (requestId !== latestRequestId.current) {
          return undefined
        }
        setSummaries(versionSummaries.summaries)
        return versionSummaries.totalCount
      } catch (err) {
        if (requestId !== latestRequestId.current) {
          return undefined
        }
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the information from the dataset versions summaries. Try again later.'
        setError(errorMessage)
        return undefined
      } finally {
        if (requestId === latestRequestId.current) {
          setIsLoading(false)
        }
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
