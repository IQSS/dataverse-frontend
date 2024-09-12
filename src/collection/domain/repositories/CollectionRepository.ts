import { Collection } from '../models/Collection'
import { CollectionFacet } from '../models/CollectionFacet'
import { CollectionUserPermissions } from '../models/CollectionUserPermissions'
import { CollectionDTO } from '../useCases/DTOs/CollectionDTO'

export interface CollectionRepository {
  getById: (id: string) => Promise<Collection>
  create(collection: CollectionDTO, hostCollection?: string): Promise<number>
  getFacets(collectionIdOrAlias: number | string): Promise<CollectionFacet[]>
  getUserPermissions(collectionIdOrAlias: number | string): Promise<CollectionUserPermissions>
}
