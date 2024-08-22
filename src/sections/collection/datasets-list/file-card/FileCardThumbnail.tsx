import styles from './FileCard.module.scss'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { FileThumbnail } from '../../../dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/file-thumbnail/FileThumbnail'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { FileCardHelper } from './FileCardHelper'
import { DvObjectType } from '../../../../shared/hierarchy/domain/models/UpwardHierarchyNode'

interface FileCardThumbnailProps {
  filePreview: FilePreview
  thumbnail?: string
}

export function FileCardThumbnail({ filePreview }: FileCardThumbnailProps) {
  return (
    <div className={styles.thumbnail}>
      <LinkToPage
        page={Route.FILES}
        type={DvObjectType.FILE}
        searchParams={FileCardHelper.getFileSearchParams(
          filePreview.id,
          filePreview.datasetPublishingStatus
        )}>
        <FileThumbnail file={filePreview} />
      </LinkToPage>
    </div>
  )
}
