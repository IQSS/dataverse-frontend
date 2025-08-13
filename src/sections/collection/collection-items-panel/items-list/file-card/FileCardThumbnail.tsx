import { useCallback, useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Icon, IconName, Tooltip } from '@iqss/dataverse-design-system'
import { FileItemTypePreview } from '@/files/domain/models/FileItemTypePreview'
import { FileJSDataverseRepository } from '@/files/infrastructure/FileJSDataverseRepository'
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
          <FileThumbnail fileId={filePreview.id} fileName={filePreview.name} iconName={iconName} />
        ) : (
          <div className={styles.icon}>
            <Icon name={iconName} />
          </div>
        )}
      </LinkToPage>
    </div>
  )
}

interface FileThumbnailProps {
  fileId: number
  fileName: string
  iconName: IconName
}

const FileThumbnail = ({ fileId, fileName, iconName }: FileThumbnailProps) => {
  const [loadingThumbnailObjectURL, setLoadingThumbnailObjectURL] = useState(true)
  const [thumbnailObjectURL, setThumbnailObjectURL] = useState<string>()

  const getThumbnailObjectURL = useCallback(async () => {
    const thumbnailObjectUrl = await FileJSDataverseRepository.getThumbnailById(fileId)

    setThumbnailObjectURL(thumbnailObjectUrl)

    setLoadingThumbnailObjectURL(false)
  }, [fileId])

  useEffect(() => {
    void getThumbnailObjectURL()
  }, [getThumbnailObjectURL])

  if (loadingThumbnailObjectURL) {
    return (
      <div data-testid="file-thumbnail-skeleton">
        <Skeleton width={64} height={48} />
      </div>
    )
  }

  // Fallback to icon if thumbnailObjectURL is still undefined after fetching it
  if (!thumbnailObjectURL) {
    return (
      <div className={styles.icon} data-testid="icon-fallback">
        <Icon name={iconName} />
      </div>
    )
  }

  return (
    <Tooltip
      overlay={
        <div className={styles.tooltip}>
          <img src={thumbnailObjectURL} alt={fileName} />
        </div>
      }
      placement="top"
      maxWidth={430}>
      <img src={thumbnailObjectURL} alt={fileName} />
    </Tooltip>
  )
}
