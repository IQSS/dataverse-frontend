import { useDatasets } from './useDatasets'
import styles from './DatasetsList.module.scss'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { useEffect, useState } from 'react'
import { PaginationResultsInfo } from '../../shared/pagination/PaginationResultsInfo'
import { PaginationControls } from '../../shared/pagination/PaginationControls'
import { DatasetPaginationInfo } from '../../../dataset/domain/models/DatasetPaginationInfo'
import { LinkToPage } from '../../shared/link-to-page/LinkToPage'
import { Route } from '../../Route.enum'
import { useLoading } from '../../loading/LoadingContext'
import { DatasetsListSkeleton } from './DatasetsListSkeleton'
import { NoDatasetsMessage } from './NoDatasetsMessage'

interface DatasetsListProps {
  datasetRepository: DatasetRepository
}
const NO_DATASETS = 0
export function DatasetsList({ datasetRepository }: DatasetsListProps) {
  const { setIsLoading } = useLoading()
  const [paginationInfo, setPaginationInfo] = useState<DatasetPaginationInfo>(
    new DatasetPaginationInfo()
  )
  const { datasets, isLoading } = useDatasets(datasetRepository, setPaginationInfo, paginationInfo)

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading])

  if (isLoading) {
    return <DatasetsListSkeleton />
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
            <article key={dataset.persistentId}>
              <LinkToPage
                page={Route.DATASETS}
                searchParams={{ persistentId: dataset.persistentId }}>
                {dataset.title}
              </LinkToPage>
            </article>
          ))}
          <PaginationControls
            onPaginationInfoChange={setPaginationInfo}
            initialPaginationInfo={paginationInfo}
            showPageSizeSelector={false}
          />
        </>
      )}
    </section>
  )
}
