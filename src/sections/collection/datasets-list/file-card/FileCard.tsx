import styles from './FileCard.module.scss'
import { FileCardHeader } from './FileCardHeader'
import { FileCardThumbnail } from './FileCardThumbnail'
import { FileCardInfo } from './FileCardInfo'
import { FilePreview } from '../../../../files/domain/models/FilePreview'

interface FileCardProps {
  filePreview: FilePreview
  persistentId: string
}

export function FileCard({ filePreview, persistentId }: FileCardProps) {
  return (
    <article className={styles.container}>
      <FileCardHeader persistentId={persistentId} filePreview={filePreview} />
      <div className={styles.info}>
        <FileCardThumbnail filePreview={filePreview} persistentId={persistentId} />
        <FileCardInfo filePreview={filePreview} />
      </div>
    </article>
  )
}
