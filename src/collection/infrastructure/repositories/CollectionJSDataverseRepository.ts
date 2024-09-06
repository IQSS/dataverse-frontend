import { CollectionRepository } from '../../domain/repositories/CollectionRepository'
import { Collection } from '../../domain/models/Collection'
import {
  createCollection,
  getCollection,
  getCollectionFacets,
  getCollectionUserPermissions
} from '@iqss/dataverse-client-javascript'
import { JSCollectionMapper } from '../mappers/JSCollectionMapper'
import { CollectionDTO } from '../../domain/useCases/DTOs/CollectionDTO'
import { CollectionFacet } from '../../domain/models/CollectionFacet'
import { CollectionUserPermissions } from '../../domain/models/CollectionUserPermissions'

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
}
