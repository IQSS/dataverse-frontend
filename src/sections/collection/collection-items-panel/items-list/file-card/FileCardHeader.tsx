import { Badge, Icon, IconName, Stack } from '@iqss/dataverse-design-system'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { FileItemTypePreview } from '@/files/domain/models/FileItemTypePreview'
import { FileType } from '@/files/domain/models/FileMetadata'
import { FileTypeToFileIconMap } from '@/sections/file/file-preview/FileTypeToFileIconMap'
import { Route } from '@/sections/Route.enum'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import { FileCardHelper } from './FileCardHelper'
import { FileAccessRestrictedIcon } from '../../../../file/file-access/FileAccessRestrictedIcon'
import styles from './FileCard.module.scss'

interface FileCardHeaderProps {
  filePreview: FileItemTypePreview
}

export function FileCardHeader({ filePreview }: FileCardHeaderProps) {
  const iconFileType = new FileType(filePreview.fileContentType)
  const iconName = FileTypeToFileIconMap[iconFileType.value] || IconName.OTHER

  const publicationStatusesFiltered = filePreview.publicationStatuses
    .filter((status) => status !== PublicationStatus.Published)
    .sort((a, b) => a.localeCompare(b))

  return (
    <header className={styles['card-header-container']}>
      <div className={styles['left-side-content']}>
        <div className={styles['restricted-icon']} data-testid="file-access-restricted-icon">
          <FileAccessRestrictedIcon
            restricted={filePreview.restricted}
            canDownloadFile={filePreview.canDownloadFile}
          />
        </div>
        <div className={styles['title-and-labels']}>
          <LinkToPage
            page={Route.FILES}
            type={DvObjectType.FILE}
            searchParams={FileCardHelper.getFileSearchParams(
              filePreview.id,
              filePreview.publicationStatuses.includes(PublicationStatus.Draft)
            )}>
            {filePreview.name}
          </LinkToPage>

          <Stack direction="horizontal" gap={1} className="flex-wrap">
            {publicationStatusesFiltered.length > 0 && (
              <Stack direction="horizontal" gap={1} className="flex-wrap">
                {publicationStatusesFiltered.map((status) => (
                  <Badge key={status} variant={BADGE_VARIANT_BY_PUBLICATION_STATUS[status]}>
                    {status}
                  </Badge>
                ))}
              </Stack>
            )}

            {filePreview.userRoles && (
              <Stack direction="horizontal" gap={1} className="flex-wrap">
                {filePreview.userRoles.map((role, index) => (
                  <Badge key={index} variant="info">
                    {role}
                  </Badge>
                ))}
              </Stack>
            )}
          </Stack>
        </div>
      </div>
      <div className={styles['top-right-icon']}>
        <Icon name={iconName} />
      </div>
    </header>
  )
}

const BADGE_VARIANT_BY_PUBLICATION_STATUS: Record<
  PublicationStatus,
  'primary' | 'secondary' | 'success' | 'danger' | 'warning'
> = {
  [PublicationStatus.Draft]: 'primary',
  [PublicationStatus.InReview]: 'success',
  [PublicationStatus.Deaccessioned]: 'danger',
  [PublicationStatus.Unpublished]: 'warning',
  [PublicationStatus.Published]: 'secondary' // This status is not shown but included for completeness
}
