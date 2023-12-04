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
      <DatasetCardHeader dataset={dataset} />
      <div className={styles.info}>
        <DatasetCardThumbnail dataset={dataset} />
        <DatasetCardInfo dataset={dataset} />
      </div>
    </article>
  )
}
