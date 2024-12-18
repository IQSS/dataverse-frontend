import { CollectionRepository } from '../../domain/repositories/CollectionRepository'
import { Collection } from '../../domain/models/Collection'
import {
  createCollection,
  getCollection,
  getCollectionFacets,
  getCollectionUserPermissions,
  getCollectionItems,
  publishCollection,
  updateCollection
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
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'

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

  getFeaturedItems(_collectionIdOrAlias?: number | string): Promise<CollectionFeaturedItem[]> {
    // TODO:ME Mocked data for now

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(CollectionFeaturedItemMother.createFeaturedItems())
      }, 1_000)
    })
  }
}
