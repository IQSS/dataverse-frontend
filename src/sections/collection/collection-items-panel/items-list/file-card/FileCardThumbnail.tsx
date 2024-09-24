import { Icon, IconName, Tooltip } from '@iqss/dataverse-design-system'
import { FileItemTypePreview } from '@/files/domain/models/FileItemTypePreview'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { FileType } from '@/files/domain/models/FileMetadata'
import { FileTypeToFileIconMap } from '@/sections/file/file-preview/FileTypeToFileIconMap'
import { FileCardHelper } from './FileCardHelper'
import { Route } from '@/sections/Route.enum'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import styles from './FileCard.module.scss'

interface FileCardThumbnailProps {
  filePreview: FileItemTypePreview
}

export function FileCardThumbnail({ filePreview }: FileCardThumbnailProps) {
  const iconFileType = new FileType(filePreview.fileContentType)
  const iconName = FileTypeToFileIconMap[iconFileType.value] || IconName.OTHER

  return (
    <div className={styles['card-thumbnail-container']}>
      <LinkToPage
        page={Route.FILES}
        type={DvObjectType.FILE}
        searchParams={FileCardHelper.getFileSearchParams(
          filePreview.id,
          filePreview.publicationStatuses.includes(PublicationStatus.Draft)
        )}>
        {filePreview.thumbnail ? (
          <Tooltip
            overlay={
              <div className={styles.tooltip}>
                <img src={filePreview.thumbnail} alt={filePreview.name} />
              </div>
            }
            placement="top"
            maxWidth={430}>
            <img src={filePreview.thumbnail} alt={filePreview.name} />
          </Tooltip>
        ) : (
          <div className={styles.icon}>
            <Icon name={iconName} />
          </div>
        )}
      </LinkToPage>
    </div>
  )
}
