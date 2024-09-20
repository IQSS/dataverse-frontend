import {
  CollectionPreview as JSCollectionPreview,
  DatasetPreview as JSDatasetPreview,
  FilePreview as JSFilePreview,
  CollectionItemType as JSCollectionItemType
} from '@iqss/dataverse-client-javascript'
import { CollectionItemTypePreview } from '../../domain/models/CollectionItemTypePreview'
import { PublicationStatus } from '../../../shared/core/domain/models/PublicationStatus'
import { CollectionItem } from '../../domain/models/CollectionItemSubset'
import { JSDatasetPreviewMapper } from '../../../dataset/infrastructure/mappers/JSDatasetPreviewMapper'
import { JSFileItemTypePreviewMapper } from './JSFileItemTypePreviewMapper'

export class JSCollectionItemsMapper {
  static toCollectionItemsPreviews(
    jsCollectionItems: (JSCollectionPreview | JSDatasetPreview | JSFilePreview)[]
  ): CollectionItem[] {
    const items: CollectionItem[] = []

    jsCollectionItems.forEach((item: JSCollectionPreview | JSDatasetPreview | JSFilePreview) => {
      if (item.type === JSCollectionItemType.FILE) {
        // TODO:ME Here we should like make all the necessary extra calls to get info for satisfied FilePreview model??
        items.push(JSFileItemTypePreviewMapper.toFileItemTypePreview(item))
      } else if (item.type === JSCollectionItemType.DATASET) {
        items.push(JSDatasetPreviewMapper.toDatasetPreview(item))
      } else if (item.type === JSCollectionItemType.COLLECTION) {
        items.push(this.toCollectionItemTypePreview(item))
      }
    })
    return items
  }

  static toCollectionItemTypePreview(
    jsDatasetPreview: JSCollectionPreview
  ): CollectionItemTypePreview {
    return {
      type: jsDatasetPreview.type,
      isReleased: JSCollectionItemsMapper.toIsRelasedCollection(
        jsDatasetPreview.publicationStatuses
      ),
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

  static toIsRelasedCollection(jsPublicationStatus: PublicationStatus[]): boolean {
    return jsPublicationStatus.includes(PublicationStatus.Published)
  }
}
