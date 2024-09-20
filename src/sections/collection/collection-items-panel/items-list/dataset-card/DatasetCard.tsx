import { DatasetPreview } from '../../../../../dataset/domain/models/DatasetPreview'
import { DatasetCardHeader } from './DatasetCardHeader'
import { DatasetCardThumbnail } from './DatasetCardThumbnail'
import { DatasetCardInfo } from './DatasetCardInfo'
import styles from './DatasetCard.module.scss'

interface DatasetCardProps {
  datasetPreview: DatasetPreview
}

export function DatasetCard({ datasetPreview }: DatasetCardProps) {
  return (
    <article className={styles['card-main-container']}>
      <DatasetCardHeader
        persistentId={datasetPreview.persistentId}
        version={datasetPreview.version}
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
