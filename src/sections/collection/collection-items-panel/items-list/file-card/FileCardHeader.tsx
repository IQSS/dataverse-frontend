import { Badge, Icon, IconName } from '@iqss/dataverse-design-system'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { FileItemTypePreview } from '@/files/domain/models/FileItemTypePreview'
import { FileType } from '@/files/domain/models/FileMetadata'
import { FileTypeToFileIconMap } from '@/sections/file/file-preview/FileTypeToFileIconMap'
import { Route } from '@/sections/Route.enum'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import { DatasetLabels } from '@/sections/dataset/dataset-labels/DatasetLabels'
import { FileCardHelper } from './FileCardHelper'
import { FileAccessRestrictedIcon } from '../../../../file/file-access/FileAccessRestrictedIcon'
import styles from './FileCard.module.scss'

interface FileCardHeaderProps {
  filePreview: FileItemTypePreview
}

export function FileCardHeader({ filePreview }: FileCardHeaderProps) {
  const iconFileType = new FileType(filePreview.fileContentType)
  const iconName = FileTypeToFileIconMap[iconFileType.value] || IconName.OTHER

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
          <DatasetLabels
            labels={FileCardHelper.getDatasetLabels(
              filePreview.publicationStatuses,
              !filePreview.publicationStatuses.includes(PublicationStatus.Unpublished)
            )}
          />
          {filePreview.userRoles &&
            filePreview.userRoles.map((role, index) => (
              <div key={index}>
                <Badge variant="success">{role}</Badge>
              </div>
            ))}
        </div>
      </div>
      <div className={styles['top-right-icon']}>
        <Icon name={iconName} />
      </div>
    </header>
  )
}
