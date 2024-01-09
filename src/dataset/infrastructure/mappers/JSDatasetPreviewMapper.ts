import { DatasetPreview as JSDatasetPreview } from '@iqss/dataverse-client-javascript/dist/datasets/domain/models/DatasetPreview'
import { DatasetPreview } from '../../domain/models/DatasetPreview'
import {
  DatasetVersionInfo as JSDatasetVersionInfo,
  DatasetVersionState as JSDatasetVersionState
} from '@iqss/dataverse-client-javascript/dist/datasets/domain/models/Dataset'
import { JSDatasetVersionMapper } from './JSDatasetVersionMapper'

export class JSDatasetPreviewMapper {
  static toDatasetPreview(jsDatasetPreview: JSDatasetPreview): DatasetPreview {
    return new DatasetPreview(
      jsDatasetPreview.persistentId,
      jsDatasetPreview.title,
      JSDatasetVersionMapper.toDatasetVersion(
        jsDatasetPreview.versionId,
        jsDatasetPreview.versionInfo
      ),
      jsDatasetPreview.versionInfo.releaseTime == undefined ? true : false,
      jsDatasetPreview.citation,
      jsDatasetPreview.versionInfo.state === JSDatasetVersionState.DEACCESSIONED,
      JSDatasetPreviewMapper.toPreviewDate(jsDatasetPreview.versionInfo),
      jsDatasetPreview.description,
      undefined // TODO: get dataset thumbnail from Dataverse https://github.com/IQSS/dataverse-frontend/issues/203
    )
  }

  static toPreviewDate(jsVersionInfo: JSDatasetVersionInfo): Date {
    return jsVersionInfo.releaseTime ? jsVersionInfo.releaseTime : jsVersionInfo.createTime
  }
}
