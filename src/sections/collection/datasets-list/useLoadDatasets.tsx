import { useMemo, useState } from 'react'
import { getDatasetsWithCount } from '../../../dataset/domain/useCases/getDatasetsWithCount'
import { DatasetPreview } from '../../../dataset/domain/models/DatasetPreview'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { DatasetPaginationInfo } from '../../../dataset/domain/models/DatasetPaginationInfo'
import { DatasetsWithCount } from '../../../dataset/domain/models/DatasetsWithCount'

export const NO_DATASETS = 0

async function loadNextDatasets(
  datasetRepository: DatasetRepository,
  collectionId: string,
  paginationInfo: DatasetPaginationInfo
): Promise<DatasetsWithCount> {
  return getDatasetsWithCount(datasetRepository, collectionId, paginationInfo).catch((_err) => {
    throw new Error('Something went wrong getting the datasets')
  })
}

export function useLoadDatasets(
  datasetRepository: DatasetRepository,
  collectionId: string,
  paginationInfo: DatasetPaginationInfo
) {
  const [isLoading, setLoading] = useState(false)
  const [accumulatedDatasets, setAccumulatedDatasets] = useState<DatasetPreview[]>([])
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [totalAvailable, setTotalAvailable] = useState<number | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  const isEmptyDatasets = useMemo(() => totalAvailable === NO_DATASETS, [totalAvailable])
  const areDatasetsAvailable = useMemo(() => {
    return typeof totalAvailable === 'number' && totalAvailable > NO_DATASETS && !error
  }, [totalAvailable, error])
  const accumulatedCount = useMemo(() => accumulatedDatasets.length, [accumulatedDatasets])

  const loadMore = async () => {
    setLoading(true)
    try {
      const { datasetPreviews, totalCount } = await loadNextDatasets(
        datasetRepository,
        collectionId,
        paginationInfo
      )
      const isNextPage = paginationInfo.page * paginationInfo.pageSize < totalCount

      setAccumulatedDatasets((current) => [...current, ...datasetPreviews])
      setTotalAvailable(totalCount)

      setHasNextPage(isNextPage)

      if (!isNextPage) {
        setLoading(false)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong getting the datasets'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    isLoading,
    accumulatedDatasets,
    totalAvailable,
    hasNextPage,
    error,
    loadMore,
    isEmptyDatasets,
    areDatasetsAvailable,
    accumulatedCount
  }
}
