import {
  DatasetVersionInfo as JSDatasetVersionInfo,
  DatasetVersionState as JSDatasetVersionState
} from '@iqss/dataverse-client-javascript/dist/datasets/domain/models/Dataset'
import {
  DatasetPublishingStatus,
  DatasetVersion,
  DatasetVersionNumber,
  TermsOfAccess
} from '../../domain/models/Dataset'

export class JSDatasetVersionMapper {
  static toVersion(
    jDatasetVersionId: number,
    jsDatasetVersionInfo: JSDatasetVersionInfo,
    jsDatasetTitle: string,
    jsDatasetCitation: string,
    jsDatasetPublicationDate?: string,
    jsDatasettermsOfAccess?: TermsOfAccess,
    jsDatasetDeaccessionedNote?: string
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
      this.toSomeDatasetVersionHasBeenReleased(jsDatasetVersionInfo, jsDatasetPublicationDate),
      jsDatasettermsOfAccess,
      jsDatasetDeaccessionedNote
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

  static toSomeDatasetVersionHasBeenReleased(
    jsDatasetVersionInfo: JSDatasetVersionInfo,
    publicationDate: string | undefined
  ): boolean {
    return (
      (jsDatasetVersionInfo.releaseTime !== undefined &&
        !isNaN(jsDatasetVersionInfo.releaseTime.getTime())) ||
      publicationDate !== undefined
    )
  }
}
