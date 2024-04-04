import { useEffect, useState } from 'react'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { getDatasetsWithCount } from '../../../dataset/domain/useCases/getDatasetsWithCount'
import { TotalDatasetsCount } from '../../../dataset/domain/models/TotalDatasetsCount'
import { DatasetPaginationInfo } from '../../../dataset/domain/models/DatasetPaginationInfo'
import { DatasetPreview } from '../../../dataset/domain/models/DatasetPreview'
import { DatasetsWithCount } from '../../../dataset/domain/models/DatasetsWithCount'

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

  const fetchDatasetsWithCount = () => {
    return getDatasetsWithCount(datasetRepository, collectionId, paginationInfo).then(
      (datasetsWithCount: DatasetsWithCount) => {
        setTotalDatasetsCount(totalDatasetsCount)
        if (datasetsWithCount.totalCount === 0) {
          setIsLoading(false)
          return Promise.resolve()
        }
        if (totalDatasetsCount !== paginationInfo.totalItems) {
          paginationInfo = paginationInfo.withTotal(datasetsWithCount.totalCount)
          onPaginationInfoChange(paginationInfo)

          if (paginationInfo.page > paginationInfo.totalPages) {
            setPageNumberNotFound(true)
            setIsLoading(false)
            return Promise.resolve()
          }
          setDatasets(datasetsWithCount.datasetPreviews)
          setIsLoading(false)
        }
      }
    )
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
