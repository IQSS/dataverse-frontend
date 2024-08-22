import {
  DatasetLabel,
  DatasetLabelSemanticMeaning,
  DatasetLabelValue,
  DatasetNonNumericVersionSearchParam,
  DatasetPublishingStatus
} from '../../../../dataset/domain/models/Dataset'
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
  static getFileSearchParams(
    id: number,
    publishingStatus: DatasetPublishingStatus
  ): Record<string, string> {
    const params: Record<string, string> = { id: id.toString() }
    if (publishingStatus === DatasetPublishingStatus.DRAFT) {
      params.datasetVersion = DatasetNonNumericVersionSearchParam.DRAFT
    }
    return params
  }

  static getDatasetLabels(
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
}
