import { useEffect, useState } from 'react'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { getDatasetsWithCount } from '../../../dataset/domain/useCases/getDatasetsWithCount'
import { TotalDatasetsCount } from '../../../dataset/domain/models/TotalDatasetsCount'
import { DatasetPaginationInfo } from '../../../dataset/domain/models/DatasetPaginationInfo'
import { DatasetPreview } from '../../../dataset/domain/models/DatasetPreview'
import { DatasetsWithCount } from '../../../dataset/domain/models/DatasetsWithCount'
import { getTotalDatasetsCount } from '../../../dataset/domain/useCases/getTotalDatasetsCount'
import { getDatasets } from '../../../dataset/domain/useCases/getDatasets'

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

  const fetchDatasetsWithCount = () => {
    console.log('fetching datasets with count')
    console.log('collectionId', collectionId)
    console.log('paginationInfo', paginationInfo)
    return getDatasetsWithCount(datasetRepository, collectionId, paginationInfo)
      .then((datasetsWithCount: DatasetsWithCount) => {
        console.log('datasetsWithCount', datasetsWithCount)
        setDatasets(datasetsWithCount.datasetPreviews)
        setTotalDatasetsCount(datasetsWithCount.totalCount)
        if (typeof datasetsWithCount.totalCount !== 'undefined') {
          if (datasetsWithCount.totalCount === 0) {
            console.log('no datasets found')
            setIsLoading(false)
            return Promise.resolve()
          }
        }
        if (datasetsWithCount.totalCount !== paginationInfo.totalItems) {
          paginationInfo = paginationInfo.withTotal(datasetsWithCount.totalCount)
          onPaginationInfoChange(paginationInfo)
        }
        console.log('paginationInfo', paginationInfo)
        console.log('totalPages', paginationInfo.totalPages)
        if (paginationInfo.page > paginationInfo.totalPages) {
          setPageNumberNotFound(true)
          setIsLoading(false)
          return Promise.resolve()
        }
        if (datasetsWithCount.totalCount !== paginationInfo.totalItems) {
          paginationInfo = paginationInfo.withTotal(datasetsWithCount.totalCount)
          onPaginationInfoChange(paginationInfo)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(JSON.stringify(error))
        throw new Error('There was an error getting the datasets')
      })
  }

  useEffect(() => {
    setIsLoading(true)
    fetchDatasetsWithCount().catch(() => {
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
