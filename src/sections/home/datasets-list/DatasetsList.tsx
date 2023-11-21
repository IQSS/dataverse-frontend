import { useDatasets } from './useDatasets'
import styles from './DatasetsList.module.scss'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { useState } from 'react'
import { PaginationResultsInfo } from '../../shared/pagination/PaginationResultsInfo'
import { PaginationControls } from '../../shared/pagination/PaginationControls'
import { DatasetPaginationInfo } from '../../../dataset/domain/models/DatasetPaginationInfo'
import { LinkToPage } from '../../shared/link-to-page/LinkToPage'
import { Route } from '../../Route.enum'

interface DatasetsListProps {
  datasetRepository: DatasetRepository
}
export function DatasetsList({ datasetRepository }: DatasetsListProps) {
  const [paginationInfo, setPaginationInfo] = useState<DatasetPaginationInfo>(
    new DatasetPaginationInfo()
  )
  const { datasets } = useDatasets(datasetRepository, setPaginationInfo, paginationInfo)

  return (
    <section className={styles.container}>
      <div>
        <PaginationResultsInfo paginationInfo={paginationInfo} />
      </div>
      {datasets.map((dataset) => (
        <article key={dataset.persistentId}>
          <LinkToPage page={Route.DATASETS} searchParams={{ persistentId: dataset.persistentId }}>
            {dataset.title}
          </LinkToPage>
        </article>
      ))}
      <PaginationControls
        onPaginationInfoChange={setPaginationInfo}
        initialPaginationInfo={paginationInfo}
        showPageSizeSelector={false}
      />
    </section>
  )
}
