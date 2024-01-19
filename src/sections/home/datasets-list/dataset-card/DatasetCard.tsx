import { DatasetPreview } from '../../../../dataset/domain/models/DatasetPreview'
import styles from './DatasetCard.module.scss'
import { DatasetCardHeader } from './DatasetCardHeader'
import { DatasetCardThumbnail } from './DatasetCardThumbnail'
import { DatasetCardInfo } from './DatasetCardInfo'

interface DatasetCardProps {
  dataset: DatasetPreview
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  return (
    <article className={styles.container}>
      <DatasetCardHeader persistentId={dataset.persistentId} version={dataset.version} />
      <div className={styles.info}>
        <DatasetCardThumbnail
          persistentId={dataset.persistentId}
          version={dataset.version}
          thumbnail={dataset.thumbnail}
        />
        <DatasetCardInfo
          version={dataset.version}
          releaseOrCreateDate={dataset.releaseOrCreateDate}
          abbreviatedDescription={dataset.abbreviatedDescription}
        />
      </div>
    </article>
  )
}
