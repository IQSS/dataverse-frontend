import { DatasetItemTypePreview } from '@/dataset/domain/models/DatasetItemTypePreview'
import { DatasetCardHeader } from './DatasetCardHeader'
import { DatasetCardThumbnail } from './DatasetCardThumbnail'
import { DatasetCardInfo } from './DatasetCardInfo'
import styles from './DatasetCard.module.scss'

interface DatasetCardProps {
  datasetPreview: DatasetItemTypePreview
}

export function DatasetCard({ datasetPreview }: DatasetCardProps) {
  console.log('DatasetCard', datasetPreview)
  return (
    <article className={styles['card-main-container']} data-testid="dataset-card">
      <DatasetCardHeader
        persistentId={datasetPreview.persistentId}
        version={datasetPreview.version}
        userRoles={datasetPreview.userRoles}
      />
      <div className={styles['thumbnail-and-info-wrapper']}>
        <DatasetCardThumbnail
          persistentId={datasetPreview.persistentId}
          version={datasetPreview.version}
          thumbnail={datasetPreview.thumbnail}
        />
        <DatasetCardInfo
          version={datasetPreview.version}
          releaseOrCreateDate={datasetPreview.releaseOrCreateDate}
          description={datasetPreview.description}
        />
      </div>
    </article>
  )
}
