import { FilePublishingStatus, FileVersion } from '../../domain/models/FileVersion'
import { DatasetPublishingStatus, DatasetVersion } from '../../../dataset/domain/models/Dataset'

export class JSFileVersionMapper {
  static toFileVersion(
    jsVersion: number,
    datasetVersion: DatasetVersion,
    jsPublicationDate?: Date
  ): FileVersion {
    const fileVersion = { number: jsVersion, publishingStatus: FilePublishingStatus.DRAFT }

    if (jsPublicationDate) {
      fileVersion.publishingStatus = FilePublishingStatus.RELEASED
    }

    if (datasetVersion.publishingStatus === DatasetPublishingStatus.DEACCESSIONED) {
      fileVersion.publishingStatus = FilePublishingStatus.DEACCESSIONED
    }

    return fileVersion
  }
}
