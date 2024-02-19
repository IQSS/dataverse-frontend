import { useDatasets } from './useDatasets'
import styles from './DatasetsList.module.scss'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { useEffect, useState } from 'react'
import { PaginationResultsInfo } from '../../shared/pagination/PaginationResultsInfo'
import { PaginationControls } from '../../shared/pagination/PaginationControls'
import { DatasetPaginationInfo } from '../../../dataset/domain/models/DatasetPaginationInfo'
import { useLoading } from '../../loading/LoadingContext'
import { DatasetsListSkeleton } from './DatasetsListSkeleton'
import { NoDatasetsMessage } from './NoDatasetsMessage'
import { DatasetCard } from './dataset-card/DatasetCard'
import { PageNumberNotFound } from './PageNumberNotFound'

interface DatasetsListProps {
  datasetRepository: DatasetRepository
  page?: number
}

const NO_DATASETS = 0
export function DatasetsList({ datasetRepository, page }: DatasetsListProps) {
  const { setIsLoading } = useLoading()
  const [paginationInfo, setPaginationInfo] = useState<DatasetPaginationInfo>(
    new DatasetPaginationInfo(page)
  )
  const { datasets, isLoading, pageNumberNotFound } = useDatasets(
    datasetRepository,
    setPaginationInfo,
    paginationInfo
  )

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading])

  if (isLoading) {
    return <DatasetsListSkeleton />
  }

  if (pageNumberNotFound) {
    return (
      <section className={styles.container}>
        <PageNumberNotFound />
      </section>
    )
  }

  return (
    <section className={styles.container}>
      {datasets.length === NO_DATASETS ? (
        <NoDatasetsMessage />
      ) : (
        <>
          <div>
            <PaginationResultsInfo paginationInfo={paginationInfo} />
          </div>
          {datasets.map((dataset) => (
            <DatasetCard dataset={dataset} key={dataset.persistentId} />
          ))}
          <PaginationControls
            onPaginationInfoChange={setPaginationInfo}
            initialPaginationInfo={paginationInfo}
            showPageSizeSelector={false}
            updateQueryParam
          />
        </>
      )}
    </section>
  )
}
