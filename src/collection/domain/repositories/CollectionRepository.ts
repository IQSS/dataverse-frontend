import { Collection } from '../models/Collection'
import { CollectionUserPermissions } from '../models/CollectionUserPermissions'
import { CollectionDTO } from '../useCases/DTOs/CollectionDTO'

export interface CollectionRepository {
  getById: (id: string) => Promise<Collection>
  create(collection: CollectionDTO, hostCollection?: string): Promise<number>
  getUserPermissions(collectionIdOrAlias: number | string): Promise<CollectionUserPermissions>
}
