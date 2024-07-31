import styles from './FileCard.module.scss'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import {
  DatasetLabel,
  DatasetLabelSemanticMeaning,
  DatasetLabelValue,
  DatasetPublishingStatus
} from '../../../../dataset/domain/models/Dataset'
import { FileIcon } from '../../../file/file-preview/FileIcon'
import { DatasetLabels } from '../../../dataset/dataset-labels/DatasetLabels'

interface FileCardHeaderProps {
  filePreview: FilePreview
}
function getSearchParams(
  id: number,
  publishingStatus: DatasetPublishingStatus
): Record<string, string> {
  const params: Record<string, string> = { id: id.toString() }
  if (publishingStatus === DatasetPublishingStatus.DRAFT) {
    // TODO: Replace with const after merge of #442
    params.datasetVersion = 'DRAFT'
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
        <FileIcon type={filePreview.metadata.type} />
      </div>
    </div>
  )
}
