import {
  DatasetNonNumericVersionSearchParam,
  DatasetPublishingStatus
} from '../../../../../dataset/domain/models/Dataset'

export class DatasetCardHelper {
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
}
