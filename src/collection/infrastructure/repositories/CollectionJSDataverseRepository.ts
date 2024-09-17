import { CollectionRepository } from '../../domain/repositories/CollectionRepository'
import { Collection } from '../../domain/models/Collection'
import {
  createCollection,
  getCollection,
  getCollectionFacets,
  getCollectionUserPermissions,
  getCollectionItems
} from '@iqss/dataverse-client-javascript'
import { JSCollectionMapper } from '../mappers/JSCollectionMapper'
import { CollectionDTO } from '../../domain/useCases/DTOs/CollectionDTO'
import { CollectionFacet } from '../../domain/models/CollectionFacet'
import { CollectionUserPermissions } from '../../domain/models/CollectionUserPermissions'
import { CollectionItemsPaginationInfo } from '../../domain/models/CollectionItemsPaginationInfo'
import { CollectionItemSubset } from '../../domain/models/CollectionItemSubset'
import { CollectionSearchCriteria } from '../../domain/models/CollectionSearchCriteria'

export class CollectionJSDataverseRepository implements CollectionRepository {
  getById(id: string): Promise<Collection> {
    return getCollection
      .execute(id)
      .then((jsCollection) => JSCollectionMapper.toCollection(jsCollection))
  }

  create(collection: CollectionDTO, hostCollection?: string): Promise<number> {
    return createCollection
      .execute(collection, hostCollection)
      .then((newCollectionIdentifier) => newCollectionIdentifier)
  }

  getFacets(collectionIdOrAlias: number | string): Promise<CollectionFacet[]> {
    return getCollectionFacets.execute(collectionIdOrAlias).then((facets) => facets)
  }

  getUserPermissions(collectionIdOrAlias: number | string): Promise<CollectionUserPermissions> {
    return getCollectionUserPermissions
      .execute(collectionIdOrAlias)
      .then((jsCollectionUserPermissions) => jsCollectionUserPermissions)
  }

  // TODO:ME After updating previews object to match the response models we should not see ts error anymore under the return keyword
  getItems(
    collectionId: string,
    paginationInfo: CollectionItemsPaginationInfo,
    searchCriteria: CollectionSearchCriteria
  ): Promise<CollectionItemSubset> {
    return getCollectionItems
      .execute(collectionId, paginationInfo?.pageSize, paginationInfo?.offset, searchCriteria)
      .then((jsCollectionItemSubset) => jsCollectionItemSubset)
  }
}
