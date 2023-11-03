import { DatasetPublishingStatus } from '../../../dataset/domain/models/Dataset'
import styles from './DatasetCitation.module.scss'
import { Icon, IconName } from '@iqss/dataverse-design-system'

interface CitationThumbnailProps {
  thumbnail?: string
  title: string
  publishingStatus: DatasetPublishingStatus
}

export function CitationThumbnail({ thumbnail, title, publishingStatus }: CitationThumbnailProps) {
  if (thumbnail && publishingStatus !== DatasetPublishingStatus.DEACCESSIONED) {
    return <img className={styles['preview-image']} src={thumbnail} alt={title} />
  }

  return (
    <div className={styles.icon}>
      <Icon name={IconName.DATASET} />
    </div>
  )
}
