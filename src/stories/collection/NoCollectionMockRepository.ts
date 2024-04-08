import { Collection } from '../../collection/domain/models/Collection'
import { CollectionMockRepository } from './CollectionMockRepository'

export class NoCollectionMockRepository extends CollectionMockRepository {
  getById(_id: string): Promise<Collection> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Collection not found')
      }, 1000)
    })
  }
}
