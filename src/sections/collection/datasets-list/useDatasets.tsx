import { useEffect, useState } from 'react'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { getDatasets } from '../../../dataset/domain/useCases/getDatasets'
import { getTotalDatasetsCount } from '../../../dataset/domain/useCases/getTotalDatasetsCount'
import { TotalDatasetsCount } from '../../../dataset/domain/models/TotalDatasetsCount'
import { DatasetPaginationInfo } from '../../../dataset/domain/models/DatasetPaginationInfo'
import { DatasetPreview } from '../../../dataset/domain/models/DatasetPreview'

export function useDatasets(
  datasetRepository: DatasetRepository,
  collectionId: string,
  onPaginationInfoChange: (paginationInfo: DatasetPaginationInfo) => void,
  paginationInfo: DatasetPaginationInfo
) {
  const [pageNumberNotFound, setPageNumberNotFound] = useState<boolean>(false)
  const [datasets, setDatasets] = useState<DatasetPreview[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [totalDatasetsCount, setTotalDatasetsCount] = useState<TotalDatasetsCount>()

  const fetchTotalDatasetsCount: () => Promise<TotalDatasetsCount> = () => {
    return getTotalDatasetsCount(datasetRepository, collectionId)
      .then((totalDatasetsCount: TotalDatasetsCount) => {
        setTotalDatasetsCount(totalDatasetsCount)
        if (totalDatasetsCount !== paginationInfo.totalItems) {
          paginationInfo = paginationInfo.withTotal(totalDatasetsCount)
          onPaginationInfoChange(paginationInfo)
        }
        return totalDatasetsCount
      })
      .catch(() => {
        throw new Error('There was an error getting the datasets count info')
      })
  }
  const fetchDatasets = (totalDatasetsCount: TotalDatasetsCount) => {
    if (typeof totalDatasetsCount !== 'undefined') {
      if (totalDatasetsCount === 0) {
        setIsLoading(false)
        return
      }
      if (paginationInfo.page > paginationInfo.totalPages) {
        setPageNumberNotFound(true)
        setIsLoading(false)
        return
      }
      return getDatasets(datasetRepository, collectionId, paginationInfo)
        .then((datasets: DatasetPreview[]) => {
          setDatasets(datasets)
          setIsLoading(false)
          return datasets
        })
        .catch(() => {
          throw new Error('There was an error getting the datasets')
        })
    }
  }

  useEffect(() => {
    setIsLoading(true)

    fetchTotalDatasetsCount()
      .then((totalDatasetsCount) => fetchDatasets(totalDatasetsCount))
      .catch(() => {
        console.error('There was an error getting the datasets')
        setIsLoading(false)
      })
  }, [datasetRepository, paginationInfo.page])

  return {
    datasets,
    totalDatasetsCount,
    isLoading,
    pageNumberNotFound
  }
}
