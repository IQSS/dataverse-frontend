import { CollectionPreview as JSCollectionPreview } from '@iqss/dataverse-client-javascript'
import { CollectionPreview } from '../../domain/models/CollectionPreview'
import { PublicationStatus } from '../../../shared/core/domain/models/PublicationStatus'

export class JSCollectionPreviewMapper {
  static toCollectionPreview(jsDatasetPreview: JSCollectionPreview): CollectionPreview {
    return {
      type: jsDatasetPreview.type,
      isReleased: JSCollectionPreviewMapper.toIsRelased(jsDatasetPreview.publicationStatuses),
      name: jsDatasetPreview.name,
      alias: jsDatasetPreview.alias,
      description: jsDatasetPreview.description,
      affiliation: jsDatasetPreview.affiliation,
      releaseOrCreateDate: jsDatasetPreview.releaseOrCreateDate,
      thumbnail: jsDatasetPreview.imageUrl,
      parentCollectionName: jsDatasetPreview.parentName,
      parentCollectionAlias: jsDatasetPreview.parentAlias
    }
  }

  static toIsRelased(jsPublicationStatus: PublicationStatus[]): boolean {
    return jsPublicationStatus.includes(PublicationStatus.Published)
  }
}
