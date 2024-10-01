import {
  CollectionPreview as JSCollectionPreview,
  DatasetPreview as JSDatasetPreview,
  FilePreview as JSFilePreview,
  CollectionItemType as JSCollectionItemType
} from '@iqss/dataverse-client-javascript'
import { PublicationStatus } from '../../../shared/core/domain/models/PublicationStatus'
import { CollectionItem } from '../../domain/models/CollectionItemSubset'
import { CollectionItemTypePreview } from '../../domain/models/CollectionItemTypePreview'
import { JSDatasetPreviewMapper } from '../../../dataset/infrastructure/mappers/JSDatasetPreviewMapper'
import { JSFileItemTypePreviewMapper } from '../../../files/infrastructure/mappers/JSFileItemTypePreviewMapper'

export class JSCollectionItemsMapper {
  static toCollectionItemsPreviews(
    jsCollectionItems: (JSCollectionPreview | JSDatasetPreview | JSFilePreview)[]
  ): CollectionItem[] {
    const items: CollectionItem[] = []

    jsCollectionItems.forEach((item: JSCollectionPreview | JSDatasetPreview | JSFilePreview) => {
      if (item.type === JSCollectionItemType.COLLECTION) {
        items.push(this.toCollectionItemTypePreview(item))
      }

      if (item.type === JSCollectionItemType.DATASET) {
        items.push(JSDatasetPreviewMapper.toDatasetItemTypePreview(item))
      }

      if (item.type === JSCollectionItemType.FILE) {
        items.push(JSFileItemTypePreviewMapper.toFileItemTypePreview(item))
      }
    })

    return items
  }

  static toCollectionItemTypePreview(
    jsCollectionPreview: JSCollectionPreview
  ): CollectionItemTypePreview {
    return {
      type: jsCollectionPreview.type,
      isReleased: JSCollectionItemsMapper.toIsRelasedCollection(
        jsCollectionPreview.publicationStatuses
      ),
      name: jsCollectionPreview.name,
      alias: jsCollectionPreview.alias,
      description: jsCollectionPreview.description,
      affiliation: jsCollectionPreview.affiliation,
      releaseOrCreateDate: jsCollectionPreview.releaseOrCreateDate,
      thumbnail: jsCollectionPreview.imageUrl,
      parentCollectionName: jsCollectionPreview.parentName,
      parentCollectionAlias: jsCollectionPreview.parentAlias
    }
  }

  static toIsRelasedCollection(jsPublicationStatus: PublicationStatus[]): boolean {
    return jsPublicationStatus.includes(PublicationStatus.Published)
  }
}
