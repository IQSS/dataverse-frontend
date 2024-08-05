import styles from './FileCard.module.scss'
import { FileCardHeader } from './FileCardHeader'
import { FileCardThumbnail } from './FileCardThumbnail'
import { FileCardInfo } from './FileCardInfo'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { Stack } from '@iqss/dataverse-design-system'

interface FileCardProps {
  filePreview: FilePreview
  persistentId: string
}

export function FileCard({ filePreview, persistentId }: FileCardProps) {
  return (
    <article className={styles.container}>
      <FileCardHeader filePreview={filePreview} />
      <div className={styles.info}>
        <Stack direction={'horizontal'} gap={1}>
          <FileCardThumbnail filePreview={filePreview} persistentId={persistentId} />
          <FileCardInfo filePreview={filePreview} persistentId={persistentId} />
        </Stack>
      </div>
    </article>
  )
}
