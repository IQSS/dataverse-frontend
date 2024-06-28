import {
  DatasetVersionInfo as JSDatasetVersionInfo,
  DatasetVersionState as JSDatasetVersionState
} from '@iqss/dataverse-client-javascript/dist/datasets/domain/models/Dataset'
import {
  DatasetPublishingStatus,
  DatasetVersion,
  DatasetVersionNumber
} from '../../domain/models/Dataset'
export class JSDatasetVersionMapper {
  static toVersion(
    jDatasetVersionId: number,
    jsDatasetVersionInfo: JSDatasetVersionInfo,
    jsDatasetTitle: string,
    jsDatasetCitation: string,
    jsDatasetPublicationDate?: string
  ): DatasetVersion {
    return new DatasetVersion.Builder(
      jDatasetVersionId,
      jsDatasetTitle,
      this.toVersionNumber(jsDatasetVersionInfo),
      this.toStatus(jsDatasetVersionInfo.state),
      jsDatasetCitation,
      true, // TODO Connect with dataset version isLatest
      false, // TODO Connect with dataset version isInReview
      this.toStatus(jsDatasetVersionInfo.state),
      jsDatasetPublicationDate !== undefined
    )
  }

  static toVersionNumber(jsDatasetVersionInfo: JSDatasetVersionInfo): DatasetVersionNumber {
    return new DatasetVersionNumber(
      jsDatasetVersionInfo.majorNumber,
      jsDatasetVersionInfo.minorNumber
    )
  }

  static toStatus(jsDatasetVersionState: JSDatasetVersionState): DatasetPublishingStatus {
    switch (jsDatasetVersionState) {
      case JSDatasetVersionState.DRAFT:
        return DatasetPublishingStatus.DRAFT
      case JSDatasetVersionState.DEACCESSIONED:
        return DatasetPublishingStatus.DEACCESSIONED
      case JSDatasetVersionState.RELEASED:
        return DatasetPublishingStatus.RELEASED
      default:
        return DatasetPublishingStatus.DRAFT
    }
  }

  static toSomeDatasetVersionHasBeenReleased(jsDatasetVersionInfo: JSDatasetVersionInfo): boolean {
    console.log('RELEASE TIME', JSON.stringify(jsDatasetVersionInfo))
    return (
      jsDatasetVersionInfo.releaseTime !== undefined &&
      !isNaN(jsDatasetVersionInfo.releaseTime.getTime())
    )
  }
}
