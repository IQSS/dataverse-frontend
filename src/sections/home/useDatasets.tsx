import { useEffect, useState } from 'react'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../dataset/domain/models/Dataset'
import { getDatasets } from '../../dataset/domain/useCases/getDatasets'
import { getTotalDatasetsCount } from '../../dataset/domain/useCases/getTotalDatasetsCount'
import { TotalDatasetsCount } from '../../dataset/domain/models/TotalDatasetsCount'
import { DatasetPaginationInfo } from '../../dataset/domain/models/DatasetPaginationInfo'

export function useDatasets(
  datasetRepository: DatasetRepository,
  onPaginationInfoChange: (paginationInfo: DatasetPaginationInfo) => void,
  paginationInfo: DatasetPaginationInfo
) {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [totalDatasetsCount, setTotalDatasetsCount] = useState<TotalDatasetsCount>()

  const fetchTotalDatasetsCount: () => Promise<TotalDatasetsCount> = () => {
    return getTotalDatasetsCount(datasetRepository)
      .then((totalDatasetsCount: TotalDatasetsCount) => {
        setTotalDatasetsCount(totalDatasetsCount)
        if (totalDatasetsCount !== paginationInfo.totalItems) {
          onPaginationInfoChange(paginationInfo.withTotal(totalDatasetsCount))
        }
        return totalDatasetsCount
      })
      .catch(() => {
        throw new Error('There was an error getting the datasets count info')
      })
  }
  const fetchDatasets = (totalDatasetsCount: TotalDatasetsCount) => {
    if (totalDatasetsCount) {
      if (totalDatasetsCount === 0) {
        setIsLoading(false)
        return
      }
      return getDatasets(datasetRepository, paginationInfo.withTotal(totalDatasetsCount))
        .then((datasets: Dataset[]) => {
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
    isLoading
  }
}
