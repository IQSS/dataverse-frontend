import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { CollectionMother } from '../../../tests/component/collection/domain/models/CollectionMother'
import { Collection } from '../../collection/domain/models/Collection'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'
import { CollectionDTO } from '../../collection/domain/useCases/DTOs/CollectionDTO'
import { CollectionUserPermissions } from '../../collection/domain/models/CollectionUserPermissions'

export class CollectionMockRepository implements CollectionRepository {
  getById(_id: string): Promise<Collection> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(CollectionMother.createRealistic())
      }, FakerHelper.loadingTimout())
    })
  }
  create(_collection: CollectionDTO, _hostCollection?: string): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, FakerHelper.loadingTimout())
    })
  }
  getUserPermissions(_collectionIdOrAlias: number | string): Promise<CollectionUserPermissions> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(CollectionMother.createUserPermissions())
      }, FakerHelper.loadingTimout())
    })
  }
}
