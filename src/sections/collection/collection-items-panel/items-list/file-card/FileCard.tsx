import { FileItemTypePreview } from '../../../../../files/domain/models/FileItemTypePreview'
import { FileCardHeader } from './FileCardHeader'
import { FileCardThumbnail } from './FileCardThumbnail'
import { FileCardInfo } from './FileCardInfo'
import styles from './FileCard.module.scss'

interface FileCardProps {
  filePreview: FileItemTypePreview
}

export function FileCard({ filePreview }: FileCardProps) {
  return (
    <article className={styles['card-main-container']}>
      <FileCardHeader filePreview={filePreview} />
      <div className={styles['thumbnail-and-info-wrapper']}>
        <FileCardThumbnail filePreview={filePreview} />
        <FileCardInfo filePreview={filePreview} />
      </div>
    </article>
  )
}
