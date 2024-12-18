import { CollectionUserPermissions } from '@iqss/dataverse-client-javascript'
import { Collection } from '../../collection/domain/models/Collection'
import { CollectionMockRepository } from './CollectionMockRepository'
import { CollectionFacet } from '../../collection/domain/models/CollectionFacet'
import { CollectionItemsPaginationInfo } from '@/collection/domain/models/CollectionItemsPaginationInfo'
import { CollectionItemSubset } from '@/collection/domain/models/CollectionItemSubset'
import { CollectionSearchCriteria } from '@/collection/domain/models/CollectionSearchCriteria'
import { CollectionDTO } from '@/collection/domain/useCases/DTOs/CollectionDTO'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'

export class CollectionLoadingMockRepository extends CollectionMockRepository {
  getById(_id?: string): Promise<Collection> {
    return new Promise(() => {})
  }
  create(_collection: CollectionDTO, _hostCollection?: string): Promise<number> {
    return new Promise(() => {})
  }
  getFacets(_collectionIdOrAlias: number | string): Promise<CollectionFacet[]> {
    return new Promise(() => {})
  }
  getUserPermissions(_collectionIdOrAlias: number | string): Promise<CollectionUserPermissions> {
    return new Promise(() => {})
  }
  getItems(
    _collectionId: string,
    _paginationInfo: CollectionItemsPaginationInfo,
    _searchCriteria?: CollectionSearchCriteria
  ): Promise<CollectionItemSubset> {
    return new Promise(() => {})
  }

  edit(_collectionIdOrAlias: string, _updatedCollection: CollectionDTO): Promise<void> {
    return new Promise(() => {})
  }

  getFeaturedItems(_collectionIdOrAlias?: number | string): Promise<CollectionFeaturedItem[]> {
    return new Promise(() => {})
  }
}
