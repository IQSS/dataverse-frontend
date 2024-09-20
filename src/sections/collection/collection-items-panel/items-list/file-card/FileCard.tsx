import { Stack } from '@iqss/dataverse-design-system'
import { FileItemTypePreview } from '../../../../../collection/domain/models/FileItemTypePreview'
import { FileCardHeader } from './FileCardHeader'
import { FileCardThumbnail } from './FileCardThumbnail'
import { FileCardInfo } from './FileCardInfo'
import styles from './FileCard.module.scss'

interface FileCardProps {
  filePreview: FileItemTypePreview
}

export function FileCard({ filePreview }: FileCardProps) {
  return (
    <article className={styles.container}>
      <FileCardHeader filePreview={filePreview} />
      <div className={styles.info}>
        <Stack direction={'horizontal'} gap={3}>
          <FileCardThumbnail filePreview={filePreview} />
          {/* <FileCardInfo filePreview={filePreview} persistentId={persistentId} /> */}
        </Stack>
      </div>
    </article>
  )
}
