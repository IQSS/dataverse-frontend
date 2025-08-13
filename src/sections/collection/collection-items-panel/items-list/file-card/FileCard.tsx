import { FileItemTypePreview } from '@/files/domain/models/FileItemTypePreview'
import { FileCardHeader } from './FileCardHeader'
import { FileCardBody } from './FileCardBody'
import styles from './FileCard.module.scss'

interface FileCardProps {
  filePreview: FileItemTypePreview
}

export function FileCard({ filePreview }: FileCardProps) {
  return (
    <article className={styles['card-main-container']} data-testid="file-card">
      <FileCardHeader filePreview={filePreview} />
      <FileCardBody filePreview={filePreview} />
    </article>
  )
}
