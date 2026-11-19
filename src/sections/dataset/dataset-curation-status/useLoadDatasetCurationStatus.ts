import { useCallback, useEffect, useState } from 'react'
import { Dataset, DatasetPublishingStatus } from '@/dataset/domain/models/Dataset'
import { DatasetCurationStatus } from '@/dataset/domain/models/DatasetCuration'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { getDatasetCurationStatus } from '@/dataset/domain/useCases/getDatasetCurationStatus'
import { getAllowedDatasetCurationLabels } from '@/dataset/domain/useCases/getAllowedDatasetCurationLabels'
import { DatasetCurationStatusContextProps } from './DatasetCurationStatusContext'

interface UseLoadDatasetCurationStatusProps {
  datasetRepository: DatasetRepository
  dataset: Dataset | undefined
  isAuthenticated: boolean
}

export const useLoadDatasetCurationStatus = ({
  datasetRepository,
  dataset,
  isAuthenticated
}: UseLoadDatasetCurationStatusProps): DatasetCurationStatusContextProps => {
  const [currentStatus, setCurrentStatus] = useState<DatasetCurationStatus | null>(null)
  const [allowedLabels, setAllowedLabels] = useState<string[]>([])
  const [canSeeCurationStatus, setCanSeeCurationStatus] = useState<boolean>(false)
  const [refreshKey, setRefreshKey] = useState<number>(0)

  const datasetId = dataset?.persistentId
  const canPublishDataset = dataset?.permissions.canPublishDataset ?? false
  const isEligible =
    isAuthenticated &&
    dataset !== undefined &&
    dataset.version.isLatest &&
    dataset.version.publishingStatus === DatasetPublishingStatus.DRAFT &&
    (dataset.permissions.canPublishDataset || dataset.permissions.canUpdateDataset)

  useEffect(() => {
    let isCancelled = false

    if (!isEligible || !datasetId) {
      setCurrentStatus(null)
      setAllowedLabels((labels) => (labels.length === 0 ? labels : []))
      setCanSeeCurationStatus(false)
      return
    }

    const loadCurationStatus = async () => {
      const [statusResult, labelsResult] = await Promise.allSettled([
        getDatasetCurationStatus(datasetRepository, datasetId),
        canPublishDataset
          ? getAllowedDatasetCurationLabels(datasetRepository, datasetId)
          : Promise.resolve([])
      ])

      if (isCancelled) return

      setCanSeeCurationStatus(statusResult.status === 'fulfilled')
      setCurrentStatus(statusResult.status === 'fulfilled' ? statusResult.value : null)
      setAllowedLabels(labelsResult.status === 'fulfilled' ? labelsResult.value : [])
    }

    void loadCurationStatus()

    return () => {
      isCancelled = true
    }
  }, [datasetRepository, datasetId, isEligible, canPublishDataset, refreshKey])

  const refreshCurationStatus = useCallback(() => setRefreshKey((key) => key + 1), [])

  return {
    currentStatus,
    allowedLabels,
    canSeeCurationStatus,
    canChangeCurationStatus: canSeeCurationStatus && canPublishDataset && allowedLabels.length > 0,
    refreshCurationStatus
  }
}
