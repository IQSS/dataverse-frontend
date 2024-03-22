import { Collection } from '../../collection/domain/models/Collection'
import { CollectionMockRepository } from './CollectionMockRepository'

export class NoCollectionMockRepository extends CollectionMockRepository {
  getById(_id: string): Promise<Collection | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined)
      }, 1000)
    })
  }
}
