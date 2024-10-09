import { Collection } from '../models/Collection'
import { CollectionFacet } from '../models/CollectionFacet'
import { CollectionItemsPaginationInfo } from '../models/CollectionItemsPaginationInfo'
import { CollectionItemSubset } from '../models/CollectionItemSubset'
import { CollectionSearchCriteria } from '../models/CollectionSearchCriteria'
import { CollectionUserPermissions } from '../models/CollectionUserPermissions'
import { CollectionDTO } from '../useCases/DTOs/CollectionDTO'

export interface CollectionRepository {
  getById: (id: string) => Promise<Collection>
  create(collection: CollectionDTO, hostCollection?: string): Promise<number>
  getFacets(collectionIdOrAlias: number | string): Promise<CollectionFacet[]>
  getUserPermissions(collectionIdOrAlias: number | string): Promise<CollectionUserPermissions>
  publish(collectionIdOrAlias: number | string): Promise<void>
  getItems(
    collectionId: string,
    paginationInfo: CollectionItemsPaginationInfo,
    searchCriteria?: CollectionSearchCriteria
  ): Promise<CollectionItemSubset>
}
