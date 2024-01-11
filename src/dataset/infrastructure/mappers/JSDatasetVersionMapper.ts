import {
  DatasetVersionInfo as JSDatasetVersionInfo,
  DatasetVersionState as JSDatasetVersionState
} from '@iqss/dataverse-client-javascript/dist/datasets/domain/models/Dataset'
import { DatasetPublishingStatus, DatasetVersion } from '../../domain/models/Dataset'
export class JSDatasetVersionMapper {
  static toDatasetVersion(
    jDatasetVersionId: number,
    jsDatasetVersionInfo: JSDatasetVersionInfo,
    requestedVersion?: string
  ): DatasetVersion {
    return new DatasetVersion(
      jDatasetVersionId,
      JSDatasetVersionMapper.toStatus(jsDatasetVersionInfo.state),
      true, // TODO Connect with dataset version isLatest
      false, // TODO Connect with dataset version isInReview
      JSDatasetVersionMapper.toStatus(jsDatasetVersionInfo.state), // TODO Connect with dataset version latestVersionState
      jsDatasetVersionInfo.majorNumber,
      jsDatasetVersionInfo.minorNumber,
      requestedVersion
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
}
