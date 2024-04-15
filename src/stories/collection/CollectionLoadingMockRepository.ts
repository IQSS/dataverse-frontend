import { Collection } from '../../collection/domain/models/Collection'
import { CollectionMockRepository } from './CollectionMockRepository'

export class CollectionLoadingMockRepository extends CollectionMockRepository {
  getById(_id: string): Promise<Collection> {
    return new Promise(() => {})
  }
}
