import { CollectionDTO, CollectionUserPermissions } from '@iqss/dataverse-client-javascript'
import { Collection } from '../../collection/domain/models/Collection'
import { CollectionMockRepository } from './CollectionMockRepository'

export class CollectionLoadingMockRepository extends CollectionMockRepository {
  getById(_id: string): Promise<Collection> {
    return new Promise(() => {})
  }
  create(_collection: CollectionDTO, _hostCollection?: string): Promise<number> {
    return new Promise(() => {})
  }
  getUserPermissions(_collectionIdOrAlias: number | string): Promise<CollectionUserPermissions> {
    return new Promise(() => {})
  }
}
