import { CollectionMother } from '../../../tests/component/collection/domain/models/CollectionMother'
import { Collection } from '../../collection/domain/models/Collection'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'
import { CollectionMockRepository } from '@/stories/collection/CollectionMockRepository'

export class UnpublishedCollectionMockRepository extends CollectionMockRepository {
  getById(_id?: string): Promise<Collection> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(CollectionMother.createUnpublished())
      }, FakerHelper.loadingTimout())
    })
  }
}
