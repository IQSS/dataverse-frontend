import styles from './DatasetThumbnail.module.scss'
import { DatasetIcon } from '../dataset-icon/DatasetIcon'

interface DatasetThumbnailProps {
  thumbnail?: string
  title: string
  isDeaccessioned?: boolean
}

export function DatasetThumbnail({ thumbnail, title, isDeaccessioned }: DatasetThumbnailProps) {
  if (thumbnail && !isDeaccessioned) {
    return <img className={styles['preview-image']} src={thumbnail} alt={title} />
  }

  return <DatasetIcon />
}
