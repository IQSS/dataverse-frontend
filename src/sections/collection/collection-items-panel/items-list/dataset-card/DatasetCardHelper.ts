import {
  DatasetNonNumericVersion,
  DatasetNonNumericVersionSearchParam,
  DatasetPublishingStatus
} from '@/dataset/domain/models/Dataset'

export class DatasetCardHelper {
  static getDatasetSearchParams(
    persistentId: string,
    publishingStatus: DatasetPublishingStatus,
    versionNumber?: string
  ): Record<string, string> {
    const params: Record<string, string> = { persistentId: persistentId }

    if (versionNumber) {
      params.version = versionNumber
    }

    if (
      versionNumber === DatasetNonNumericVersion.DRAFT &&
      publishingStatus === DatasetPublishingStatus.DEACCESSIONED
    ) {
      params.version = DatasetNonNumericVersion.LATEST_PUBLISHED
    }

    if (publishingStatus === DatasetPublishingStatus.DRAFT) {
      params.version = DatasetNonNumericVersionSearchParam.DRAFT
    }
    return params
  }
}
