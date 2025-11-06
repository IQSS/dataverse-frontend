import { Collection } from '../models/Collection'
import { CollectionFacet } from '../models/CollectionFacet'
import { FeaturedItem } from '../models/FeaturedItem'
import { CollectionItemsPaginationInfo } from '../models/CollectionItemsPaginationInfo'
import { CollectionItemSubset } from '../models/CollectionItemSubset'
import { MyDataCollectionItemSubset } from '../models/MyDataCollectionItemSubset'
import { CollectionSearchCriteria } from '../models/CollectionSearchCriteria'
import { CollectionUserPermissions } from '../models/CollectionUserPermissions'
import { CollectionDTO } from '../useCases/DTOs/CollectionDTO'
import { FeaturedItemsDTO } from '../useCases/DTOs/FeaturedItemsDTO'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'
import { LinkingObjectType } from '../useCases/getCollectionsForLinking'
import { CollectionSummary } from '../models/CollectionSummary'
import { CollectionLinks } from '../models/CollectionLinks'
import { MyDataCollectionItemsPaginationInfo } from '../models/MyDataCollectionItemsPaginationInfo'

export interface CollectionRepository {
  getById: (id?: string) => Promise<Collection>
  create(collection: CollectionDTO, hostCollection?: string): Promise<number>
  delete(collectionIdOrAlias: number | string): Promise<void>
  getFacets(collectionIdOrAlias?: number | string): Promise<CollectionFacet[]>
  getUserPermissions(collectionIdOrAlias?: number | string): Promise<CollectionUserPermissions>
  publish(collectionIdOrAlias: number | string): Promise<void>
  getItems(
    collectionId: string,
    paginationInfo: CollectionItemsPaginationInfo,
    searchCriteria?: CollectionSearchCriteria,
    searchService?: string
  ): Promise<CollectionItemSubset>
  getMyDataItems: (
    roleIds: number[],
    collectionItemTypes: CollectionItemType[],
    publicationStatuses: PublicationStatus[],
    paginationInfo?: MyDataCollectionItemsPaginationInfo,
    searchText?: string,
    otherUserName?: string
  ) => Promise<MyDataCollectionItemSubset>
  edit(collectionIdOrAlias: string, updatedCollection: CollectionDTO): Promise<void>
  getFeaturedItems(collectionIdOrAlias?: number | string): Promise<FeaturedItem[]>
  updateFeaturedItems(
    collectionIdOrAlias: number | string,
    featuredItemsDTO: FeaturedItemsDTO
  ): Promise<FeaturedItem[]>
  deleteFeaturedItems(collectionIdOrAlias: number | string): Promise<void>
  deleteFeaturedItem(featuredItemId: number): Promise<void>
  getForLinking(
    objectType: LinkingObjectType,
    id: number | string,
    searchTerm?: string
  ): Promise<CollectionSummary[]>
  getForUnlinking(
    objectType: LinkingObjectType,
    id: number | string,
    searchTerm?: string
  ): Promise<CollectionSummary[]>
  link(
    linkedCollectionIdOrAlias: number | string,
    linkingCollectionIdOrAlias: number | string
  ): Promise<void>
  getLinks(collectionIdOrAlias: number | string): Promise<CollectionLinks>
}
