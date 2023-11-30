import styles from './DatasetThumbnail.module.scss'
import { Icon, IconName } from '@iqss/dataverse-design-system'

interface DatasetThumbnailProps {
  thumbnail?: string
  title: string
  isDeaccessioned?: boolean
}

export function DatasetThumbnail({ thumbnail, title, isDeaccessioned }: DatasetThumbnailProps) {
  if (thumbnail && !isDeaccessioned) {
    return <img className={styles['preview-image']} src={thumbnail} alt={title} />
  }

  return (
    <div className={styles.icon}>
      <Icon name={IconName.DATASET} />
    </div>
  )
}
