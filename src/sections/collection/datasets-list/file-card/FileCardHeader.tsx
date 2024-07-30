import styles from './FileCard.module.scss'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { DatasetPublishingStatus } from '../../../../dataset/domain/models/Dataset'
import { FileIcon } from '../../../file/file-preview/FileIcon'

interface FileCardHeaderProps {
  persistentId: string
  filePreview: FilePreview
}
function getSearchParams(
  persistentId: string,
  publishingStatus: DatasetPublishingStatus
): Record<string, string> {
  const params: Record<string, string> = { persistentId: persistentId }
  if (publishingStatus === DatasetPublishingStatus.DRAFT) {
    // TODO: Replace with const after merge of #442
    params.version = 'DRAFT'
  }
  return params
}

export function FileCardHeader({ persistentId, filePreview }: FileCardHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <LinkToPage
          page={Route.FILES}
          searchParams={getSearchParams(persistentId, filePreview.datasetPublishingStatus)}>
          {filePreview.name}
        </LinkToPage>
      </div>
      <div className={styles.icon}>
        <FileIcon type={filePreview.metadata.type} />
      </div>
    </div>
  )
}
