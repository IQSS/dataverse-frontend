import { CollectionDTO, CollectionUserPermissions } from '@iqss/dataverse-client-javascript'
import { Collection } from '../../collection/domain/models/Collection'
import { CollectionMockRepository } from './CollectionMockRepository'
import { CollectionFacet } from '../../collection/domain/models/CollectionFacet'

export class CollectionLoadingMockRepository extends CollectionMockRepository {
  getById(_id: string): Promise<Collection> {
    return new Promise(() => {})
  }
  create(_collection: CollectionDTO, _hostCollection?: string): Promise<number> {
    return new Promise(() => {})
  }
  getFacets(_collectionIdOrAlias: number | string): Promise<CollectionFacet[]> {
    return new Promise(() => {})
  }
  getUserPermissions(_collectionIdOrAlias: number | string): Promise<CollectionUserPermissions> {
    return new Promise(() => {})
  }
}
