import { DatasetItemTypePreview } from '@/dataset/domain/models/DatasetItemTypePreview'
import { DatasetCardHeader } from './DatasetCardHeader'
import { DatasetCardBody } from './DatasetCardBody'
import styles from './DatasetCard.module.scss'

interface DatasetCardProps {
  datasetPreview: DatasetItemTypePreview
}

export function DatasetCard({ datasetPreview }: DatasetCardProps) {
  return (
    <article className={styles['card-main-container']} data-testid="dataset-card">
      <DatasetCardHeader
        persistentId={datasetPreview.persistentId}
        version={datasetPreview.version}
        userRoles={datasetPreview.userRoles}
      />
      <DatasetCardBody datasetPreview={datasetPreview} />
    </article>
  )
}
