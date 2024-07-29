import styles from './FileCard.module.scss'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { FileThumbnail } from '../../../dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/file-thumbnail/FileThumbnail'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { DatasetPublishingStatus } from '../../../../dataset/domain/models/Dataset'

interface FileCardThumbnailProps {
  persistentId: string
  filePreview: FilePreview
  thumbnail?: string
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
export function FileCardThumbnail({ persistentId, filePreview }: FileCardThumbnailProps) {
  return (
    <div className={styles.thumbnail}>
      <LinkToPage
        page={Route.FILES}
        searchParams={getSearchParams(persistentId, filePreview.datasetPublishingStatus)}>
        <FileThumbnail file={filePreview} />
      </LinkToPage>
    </div>
  )
}
