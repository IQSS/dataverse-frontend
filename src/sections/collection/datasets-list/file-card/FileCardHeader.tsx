import styles from './FileCard.module.scss'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import {
  DatasetLabel,
  DatasetLabelSemanticMeaning,
  DatasetLabelValue,
  DatasetNonNumericVersionSearchParam,
  DatasetPublishingStatus
} from '../../../../dataset/domain/models/Dataset'
import { DatasetLabels } from '../../../dataset/dataset-labels/DatasetLabels'
import { FileCardIcon } from './FileCardIcon'
import { FileType } from '../../../../files/domain/models/FileMetadata'

interface FileCardHeaderProps {
  filePreview: FilePreview
}
function getSearchParams(
  id: number,
  publishingStatus: DatasetPublishingStatus
): Record<string, string> {
  const params: Record<string, string> = { id: id.toString() }
  if (publishingStatus === DatasetPublishingStatus.DRAFT) {
    params.datasetVersion = DatasetNonNumericVersionSearchParam.DRAFT
  }
  return params
}
function getDatasetLabels(
  datasetPublishingStatus: DatasetPublishingStatus,
  someDatasetVersionHasBeenReleased: boolean | undefined
) {
  const labels: DatasetLabel[] = []
  if (datasetPublishingStatus === DatasetPublishingStatus.DRAFT) {
    labels.push(new DatasetLabel(DatasetLabelSemanticMeaning.DATASET, DatasetLabelValue.DRAFT))
  }
  if (
    someDatasetVersionHasBeenReleased == undefined ||
    someDatasetVersionHasBeenReleased == false
  ) {
    labels.push(
      new DatasetLabel(DatasetLabelSemanticMeaning.WARNING, DatasetLabelValue.UNPUBLISHED)
    )
  }
  return labels
}
export function FileCardHeader({ filePreview }: FileCardHeaderProps) {
  const iconFileType = new FileType('text/tab-separated-values', 'Comma Separated Values')
  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <LinkToPage
          page={Route.FILES}
          searchParams={getSearchParams(filePreview.id, filePreview.datasetPublishingStatus)}>
          {filePreview.name}
        </LinkToPage>
        <DatasetLabels
          labels={getDatasetLabels(
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
