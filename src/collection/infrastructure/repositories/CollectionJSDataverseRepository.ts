import { CollectionRepository } from '../../domain/repositories/CollectionRepository'
import { Collection } from '../../domain/models/Collection'
import {
  DvObjectType,
  UpwardHierarchyNode
} from '../../../shared/hierarchy/domain/models/UpwardHierarchyNode'

export class CollectionJSDataverseRepository implements CollectionRepository {
  getById(_id: string): Promise<Collection | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'collection1',
          name: 'Collection 1',
          description: 'Description 1',
          affiliation: 'Affiliation 1',
          hierarchy: new UpwardHierarchyNode(
            'Collection 1',
            DvObjectType.COLLECTION,
            'collection1',
            undefined,
            undefined
          )
        })
      }, 1000)
    })
  }
}
