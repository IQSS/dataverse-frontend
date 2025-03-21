import { CollectionRepository } from '../../domain/repositories/CollectionRepository'
import { Collection } from '../../domain/models/Collection'
import {
  createCollection,
  getCollection,
  getCollectionFacets,
  getCollectionUserPermissions,
  getCollectionItems,
  publishCollection,
  updateCollection,
  getCollectionFeaturedItems,
  updateCollectionFeaturedItems,
  deleteCollectionFeaturedItems,
  deleteCollection
} from '@iqss/dataverse-client-javascript'
import { JSCollectionMapper } from '../mappers/JSCollectionMapper'
import { CollectionDTO } from '../../domain/useCases/DTOs/CollectionDTO'
import { CollectionFacet } from '../../domain/models/CollectionFacet'
import { CollectionUserPermissions } from '../../domain/models/CollectionUserPermissions'
import { CollectionItemsPaginationInfo } from '../../domain/models/CollectionItemsPaginationInfo'
import { CollectionItemSubset } from '../../domain/models/CollectionItemSubset'
import { CollectionSearchCriteria } from '../../domain/models/CollectionSearchCriteria'
import { JSCollectionItemsMapper } from '../mappers/JSCollectionItemsMapper'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { CollectionFeaturedItemsDTO } from '@/collection/domain/useCases/DTOs/CollectionFeaturedItemsDTO'

export class CollectionJSDataverseRepository implements CollectionRepository {
  getById(id?: string): Promise<Collection> {
    return getCollection
      .execute(id)
      .then((jsCollection) => JSCollectionMapper.toCollection(jsCollection))
  }

  create(collection: CollectionDTO, hostCollection?: string): Promise<number> {
    return createCollection
      .execute(collection, hostCollection)
      .then((newCollectionIdentifier) => newCollectionIdentifier)
  }

  delete(collectionIdOrAlias: number | string): Promise<void> {
    return deleteCollection.execute(collectionIdOrAlias)
  }

  getFacets(collectionIdOrAlias?: number | string): Promise<CollectionFacet[]> {
    return getCollectionFacets.execute(collectionIdOrAlias).then((facets) => facets)
  }

  getUserPermissions(collectionIdOrAlias?: number | string): Promise<CollectionUserPermissions> {
    return getCollectionUserPermissions
      .execute(collectionIdOrAlias)
      .then((jsCollectionUserPermissions) => jsCollectionUserPermissions)
  }

  getItems(
    collectionId: string,
    paginationInfo: CollectionItemsPaginationInfo,
    searchCriteria: CollectionSearchCriteria
  ): Promise<CollectionItemSubset> {
    return getCollectionItems
      .execute(collectionId, paginationInfo?.pageSize, paginationInfo?.offset, searchCriteria)
      .then((jsCollectionItemSubset) => {
        const collectionItemsPreviewsMapped = JSCollectionItemsMapper.toCollectionItemsPreviews(
          jsCollectionItemSubset.items
        )

        return {
          items: collectionItemsPreviewsMapped,
          facets: jsCollectionItemSubset.facets,
          totalItemCount: jsCollectionItemSubset.totalItemCount
        }
      })
  }

  publish(collectionIdOrAlias: number | string): Promise<void> {
    return publishCollection.execute(collectionIdOrAlias)
  }

  edit(collectionIdOrAlias: string, updatedCollection: CollectionDTO): Promise<void> {
    return updateCollection.execute(collectionIdOrAlias, updatedCollection)
  }

  getFeaturedItems(collectionIdOrAlias?: number | string): Promise<CollectionFeaturedItem[]> {
    return getCollectionFeaturedItems.execute(collectionIdOrAlias)
  }

  updateFeaturedItems(
    collectionIdOrAlias: number | string,
    featuredItemsDTO: CollectionFeaturedItemsDTO
  ): Promise<CollectionFeaturedItem[]> {
    return updateCollectionFeaturedItems.execute(collectionIdOrAlias, featuredItemsDTO)
  }

  deleteFeaturedItems(collectionIdOrAlias: number | string): Promise<void> {
    return deleteCollectionFeaturedItems.execute(collectionIdOrAlias)
  }
}
