import { Icon, IconName } from '@iqss/dataverse-design-system'
import { PublicationStatus } from '../../../../../shared/core/domain/models/PublicationStatus'
import { DvObjectType } from '../../../../../shared/hierarchy/domain/models/UpwardHierarchyNode'
import { FileItemTypePreview } from '../../../../../files/domain/models/FileItemTypePreview'
import { FileType } from '../../../../../files/domain/models/FileMetadata'
import { FileTypeToFileIconMap } from '../../../../file/file-preview/FileTypeToFileIconMap'
import { FileCardHelper } from './FileCardHelper'
import { Route } from '../../../../Route.enum'
import { LinkToPage } from '../../../../shared/link-to-page/LinkToPage'
import { DatasetLabels } from '../../../../dataset/dataset-labels/DatasetLabels'
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
      </div>
      <div className={styles['top-right-icon']}>
        <Icon name={iconName} />
      </div>
    </header>
  )
}
