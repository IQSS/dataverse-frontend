import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DatasetCurationStatus } from '@/dataset/domain/models/DatasetCuration'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { getDatasetCurationStatusHistory } from '@/dataset/domain/useCases/getDatasetCurationStatusHistory'

interface UseGetDatasetCurationStatusHistoryProps {
  datasetRepository: DatasetRepository
  datasetId: string | number
  enabled: boolean
}

interface UseGetDatasetCurationStatusHistoryReturn {
  history: DatasetCurationStatus[]
  isLoading: boolean
  error: string | null
}

export const useGetDatasetCurationStatusHistory = ({
  datasetRepository,
  datasetId,
  enabled
}: UseGetDatasetCurationStatusHistoryProps): UseGetDatasetCurationStatusHistoryReturn => {
  const { t } = useTranslation('dataset')
  const [history, setHistory] = useState<DatasetCurationStatus[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    let isCancelled = false

    const loadHistory = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const statuses = await getDatasetCurationStatusHistory(datasetRepository, datasetId)
        if (!isCancelled) setHistory(statuses)
      } catch {
        if (!isCancelled) {
          setHistory([])
          setError(t('curationStatus.history.error'))
        }
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }

    void loadHistory()

    return () => {
      isCancelled = true
    }
  }, [datasetRepository, datasetId, enabled, t])

  return { history, isLoading, error }
}
