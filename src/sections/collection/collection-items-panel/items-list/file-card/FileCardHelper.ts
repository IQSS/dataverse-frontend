import {
  DatasetLabel,
  DatasetLabelSemanticMeaning,
  DatasetLabelValue,
  DatasetNonNumericVersionSearchParam,
  DatasetPublishingStatus
} from '../../../../../dataset/domain/models/Dataset'
import { PublicationStatus } from '../../../../../shared/core/domain/models/PublicationStatus'

export class FileCardHelper {
  static getDatasetSearchParams(
    persistentId: string,
    publishingStatus: DatasetPublishingStatus
  ): Record<string, string> {
    const params: Record<string, string> = { persistentId: persistentId }
    if (publishingStatus === DatasetPublishingStatus.DRAFT) {
      params.version = DatasetNonNumericVersionSearchParam.DRAFT
    }
    return params
  }
  static getFileSearchParams(id: number, isDraft: boolean): Record<string, string> {
    const params: Record<string, string> = { id: id.toString() }
    if (isDraft) {
      params.datasetVersion = DatasetNonNumericVersionSearchParam.DRAFT
    }
    return params
  }

  static getDatasetLabels(
    publicationStatuses: PublicationStatus[],
    someDatasetVersionHasBeenReleased: boolean | undefined
  ) {
    const labels: DatasetLabel[] = []
    if (publicationStatuses.includes(PublicationStatus.Draft)) {
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
}
