import { useDatasets } from '../useDatasets'
import styles from '../Home.module.scss'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { useState } from 'react'
import { PaginationResultsInfo } from '../../shared/pagination/PaginationResultsInfo'
import { PaginationControls } from '../../shared/pagination/PaginationControls'
import { DatasetPaginationInfo } from '../../../dataset/domain/models/DatasetPaginationInfo'

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
          <a href={`/datasets?persistentId=${dataset.persistentId}`}>{dataset.title}</a>
        </article>
      ))}
      <PaginationControls
        onPaginationInfoChange={setPaginationInfo}
        itemName={paginationInfo.itemName}
        page={paginationInfo.page}
        pageSize={paginationInfo.pageSize}
        total={paginationInfo.totalItems}
      />
    </section>
  )
}
