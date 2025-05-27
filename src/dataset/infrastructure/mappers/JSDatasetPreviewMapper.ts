import { DatasetPreview as JSDatasetPreview } from '@iqss/dataverse-client-javascript/dist/datasets/domain/models/DatasetPreview'
import { DatasetItemTypePreview } from '../../domain/models/DatasetItemTypePreview'
import { DatasetVersionInfo as JSDatasetVersionInfo } from '@iqss/dataverse-client-javascript/dist/datasets/domain/models/Dataset'
import { JSDatasetVersionMapper } from './JSDatasetVersionMapper'

export class JSDatasetPreviewMapper {
  static toDatasetItemTypePreview(jsDatasetPreview: JSDatasetPreview): DatasetItemTypePreview {
    return {
      type: jsDatasetPreview.type,
      persistentId: jsDatasetPreview.persistentId,
      version: JSDatasetVersionMapper.toVersion(
        jsDatasetPreview.versionId,
        jsDatasetPreview.versionInfo,
        jsDatasetPreview.title,
        jsDatasetPreview.citation
      ),
      releaseOrCreateDate: JSDatasetPreviewMapper.toPreviewDate(jsDatasetPreview.versionInfo),
      description: jsDatasetPreview.description,
      thumbnail: jsDatasetPreview.imageUrl,
      publicationStatuses: jsDatasetPreview.publicationStatuses,
      parentCollectionName: jsDatasetPreview.parentCollectionName,
      parentCollectionAlias: jsDatasetPreview.parentCollectionAlias,
      userRoles: jsDatasetPreview.userRoles
    }
  }

  static toPreviewDate(jsVersionInfo: JSDatasetVersionInfo): Date {
    return jsVersionInfo.releaseTime ? jsVersionInfo.releaseTime : jsVersionInfo.createTime
  }
}
