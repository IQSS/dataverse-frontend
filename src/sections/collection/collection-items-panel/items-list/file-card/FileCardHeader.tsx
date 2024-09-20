import { FileItemTypePreview } from '../../../../../collection/domain/models/FileItemTypePreview'
import { FileType } from '../../../../../files/domain/models/FileMetadata'
import { PublicationStatus } from '../../../../../shared/core/domain/models/PublicationStatus'
import { DvObjectType } from '../../../../../shared/hierarchy/domain/models/UpwardHierarchyNode'
import { Route } from '../../../../Route.enum'
import { LinkToPage } from '../../../../shared/link-to-page/LinkToPage'
import { DatasetLabels } from '../../../../dataset/dataset-labels/DatasetLabels'
import { FileCardHelper } from './FileCardHelper'
import { FileCardIcon } from './FileCardIcon'
import styles from './FileCard.module.scss'

interface FileCardHeaderProps {
  filePreview: FileItemTypePreview
}

export function FileCardHeader({ filePreview }: FileCardHeaderProps) {
  const iconFileType = new FileType('text/tab-separated-values', 'Comma Separated Values')

  return (
    <div className={styles.header}>
      <div className={styles.title}>
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
      <div className={styles.icon}>
        <FileCardIcon type={iconFileType} />
      </div>
    </div>
  )
}
