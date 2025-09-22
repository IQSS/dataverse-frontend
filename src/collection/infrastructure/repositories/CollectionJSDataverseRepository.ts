import { CollectionRepository } from '../../domain/repositories/CollectionRepository'
import { Collection } from '../../domain/models/Collection'
import {
  createCollection,
  getCollection,
  getCollectionFacets,
  getCollectionUserPermissions,
  getCollectionItems,
  getMyDataCollectionItems,
  publishCollection,
  updateCollection,
  getCollectionFeaturedItems,
  updateCollectionFeaturedItems,
  deleteCollectionFeaturedItems,
  deleteCollection,
  deleteCollectionFeaturedItem,
  getCollectionsForLinking,
  linkCollection,
  getCollectionLinks
} from '@iqss/dataverse-client-javascript'
import { JSCollectionMapper } from '../mappers/JSCollectionMapper'
import { CollectionDTO } from '../../domain/useCases/DTOs/CollectionDTO'
import { CollectionFacet } from '../../domain/models/CollectionFacet'
import { CollectionUserPermissions } from '../../domain/models/CollectionUserPermissions'
import { CollectionItemsPaginationInfo } from '../../domain/models/CollectionItemsPaginationInfo'
import { CollectionItemSubset } from '../../domain/models/CollectionItemSubset'
import { CollectionSearchCriteria } from '../../domain/models/CollectionSearchCriteria'
import { JSCollectionItemsMapper } from '../mappers/JSCollectionItemsMapper'
import { FeaturedItem } from '@/collection/domain/models/FeaturedItem'
import { FeaturedItemsDTO } from '@/collection/domain/useCases/DTOs/FeaturedItemsDTO'
import { MyDataCollectionItemSubset } from '@/collection/domain/models/MyDataCollectionItemSubset'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'
import { CollectionSummary } from '@/collection/domain/models/CollectionSummary'
import { LinkingObjectType } from '@/collection/domain/useCases/getCollectionsForLinking'
import { CollectionLinks } from '@/collection/domain/models/CollectionLinks'

export class CollectionJSDataverseRepository implements CollectionRepository {
  getById(id?: string): Promise<Collection> {
    return getCollection
      .execute(id)
      .then((jsCollection) => JSCollectionMapper.toCollection(jsCollection))
  }

  create(collection: CollectionDTO, hostCollection?: string): Promise<number> {
    return createCollection
      .execute(collection, hostCollection)
      .then((newCollectionIdentifier) => newCollectionIdentifier)
  }

  delete(collectionIdOrAlias: number | string): Promise<void> {
    return deleteCollection.execute(collectionIdOrAlias)
  }

  getFacets(collectionIdOrAlias?: number | string): Promise<CollectionFacet[]> {
    return getCollectionFacets.execute(collectionIdOrAlias).then((facets) => facets)
  }

  getUserPermissions(collectionIdOrAlias?: number | string): Promise<CollectionUserPermissions> {
    return getCollectionUserPermissions
      .execute(collectionIdOrAlias)
      .then((jsCollectionUserPermissions) => jsCollectionUserPermissions)
  }

  getItems(
    collectionId: string,
    paginationInfo: CollectionItemsPaginationInfo,
    searchCriteria: CollectionSearchCriteria,
    searchService?: string
  ): Promise<CollectionItemSubset> {
    return getCollectionItems
      .execute(
        collectionId,
        paginationInfo?.pageSize,
        paginationInfo?.offset,
        searchCriteria,
        searchService
      )
      .then((jsCollectionItemSubset) => {
        const collectionItemsPreviewsMapped = JSCollectionItemsMapper.toCollectionItemsPreviews(
          jsCollectionItemSubset.items
        )

        return {
          items: collectionItemsPreviewsMapped,
          facets: jsCollectionItemSubset.facets,
          totalItemCount: jsCollectionItemSubset.totalItemCount
        }
      })
  }

  getMyDataItems(
    roleIds: number[],
    collectionItemTypes: CollectionItemType[],
    publicationStatuses: PublicationStatus[],
    limit?: number,
    selectedPage?: number,
    searchText?: string,
    otherUserName?: string
  ): Promise<MyDataCollectionItemSubset> {
    return getMyDataCollectionItems
      .execute(
        roleIds,
        collectionItemTypes,
        publicationStatuses,
        limit,
        selectedPage,
        searchText,
        otherUserName
      )
      .then((jsCollectionItemSubset) => {
        const collectionItemsPreviewsMapped = JSCollectionItemsMapper.toCollectionItemsPreviews(
          jsCollectionItemSubset.items
        )

        return {
          items: collectionItemsPreviewsMapped,
          publicationStatusCounts: jsCollectionItemSubset.publicationStatusCounts,
          totalItemCount: jsCollectionItemSubset.totalItemCount,
          countPerObjectType: jsCollectionItemSubset.countPerObjectType
        }
      })
  }

  publish(collectionIdOrAlias: number | string): Promise<void> {
    return publishCollection.execute(collectionIdOrAlias)
  }

  edit(collectionIdOrAlias: string, updatedCollection: CollectionDTO): Promise<void> {
    return updateCollection.execute(collectionIdOrAlias, updatedCollection)
  }

  getFeaturedItems(collectionIdOrAlias?: number | string): Promise<FeaturedItem[]> {
    return getCollectionFeaturedItems.execute(collectionIdOrAlias)
  }

  updateFeaturedItems(
    collectionIdOrAlias: number | string,
    featuredItemsDTO: FeaturedItemsDTO
  ): Promise<FeaturedItem[]> {
    return updateCollectionFeaturedItems.execute(collectionIdOrAlias, featuredItemsDTO)
  }

  deleteFeaturedItems(collectionIdOrAlias: number | string): Promise<void> {
    return deleteCollectionFeaturedItems.execute(collectionIdOrAlias)
  }

  deleteFeaturedItem(featuredItemId: number): Promise<void> {
    return deleteCollectionFeaturedItem.execute(featuredItemId)
  }

  getForLinking(
    objectType: LinkingObjectType,
    id: number | string,
    searchTerm?: string
  ): Promise<CollectionSummary[]> {
    return getCollectionsForLinking.execute(objectType, id, searchTerm)
  }

  getForUnlinking(
    objectType: LinkingObjectType,
    id: number | string,
    searchTerm?: string
  ): Promise<CollectionSummary[]> {
    return getCollectionsForLinking.execute(objectType, id, searchTerm, true)
  }

  link(
    linkedCollectionIdOrAlias: number | string,
    linkingCollectionIdOrAlias: number | string
  ): Promise<void> {
    return linkCollection.execute(linkedCollectionIdOrAlias, linkingCollectionIdOrAlias)
  }

  getLinks(collectionIdOrAlias: number | string): Promise<CollectionLinks> {
    return getCollectionLinks.execute(collectionIdOrAlias)
  }
}
