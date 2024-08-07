import styles from './FileCard.module.scss'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { DatasetLabels } from '../../../dataset/dataset-labels/DatasetLabels'
import { FileCardIcon } from './FileCardIcon'
import { FileType } from '../../../../files/domain/models/FileMetadata'
import { FileCardHelper } from './FileCardHelper'

interface FileCardHeaderProps {
  filePreview: FilePreview
}

export function FileCardHeader({ filePreview }: FileCardHeaderProps) {
  const iconFileType = new FileType('text/tab-separated-values', 'Comma Separated Values')
  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <LinkToPage
          page={Route.FILES}
          searchParams={FileCardHelper.getFileSearchParams(
            filePreview.id,
            filePreview.datasetPublishingStatus
          )}>
          {filePreview.name}
        </LinkToPage>
        <DatasetLabels
          labels={FileCardHelper.getDatasetLabels(
            filePreview.datasetPublishingStatus,
            filePreview.someDatasetVersionHasBeenReleased
          )}
        />
      </div>
      <div className={styles.icon}>
        <FileCardIcon type={iconFileType} />
      </div>
    </div>
  )
}
