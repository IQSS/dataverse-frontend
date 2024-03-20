import { CollectionRepository } from '../../domain/repositories/CollectionRepository'
import { Collection } from '../../domain/models/Collection'

export class CollectionJSDataverseRepository implements CollectionRepository {
  getById(_id: string): Promise<Collection | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          name: 'Collection 1',
          description: 'Description 1',
          affiliation: 'Affiliation 1'
        })
      }, 1000)
    })
  }
}
