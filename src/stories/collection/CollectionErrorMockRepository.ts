import { CollectionItemsPaginationInfo } from '@/collection/domain/models/CollectionItemsPaginationInfo'
import { CollectionItemSubset } from '@/collection/domain/models/CollectionItemSubset'
import { CollectionSearchCriteria } from '@/collection/domain/models/CollectionSearchCriteria'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'
import { Collection } from '../../collection/domain/models/Collection'
import { CollectionFacet } from '../../collection/domain/models/CollectionFacet'
import { CollectionMockRepository } from './CollectionMockRepository'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { CollectionFeaturedItemsDTO } from '@/collection/domain/useCases/DTOs/CollectionFeaturedItemsDTO'

export class CollectionErrorMockRepository extends CollectionMockRepository {
  getById(_id?: string): Promise<Collection> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong')
      }, FakerHelper.loadingTimout())
    })
  }

  delete(_collectionIdOrAlias: number | string): Promise<void> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong')
      }, FakerHelper.loadingTimout())
    })
  }

  getFacets(_collectionIdOrAlias: number | string): Promise<CollectionFacet[]> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong')
      }, FakerHelper.loadingTimout())
    })
  }

  getItems(
    _collectionId: string,
    _paginationInfo: CollectionItemsPaginationInfo,
    _searchCriteria?: CollectionSearchCriteria
  ): Promise<CollectionItemSubset> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong')
      }, FakerHelper.loadingTimout())
    })
  }

  getFeaturedItems(_collectionIdOrAlias?: number | string): Promise<CollectionFeaturedItem[]> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong')
      }, FakerHelper.loadingTimout())
    })
  }

  updateFeaturedItems(
    _collectionId: string,
    _featuredItemsDTO: CollectionFeaturedItemsDTO
  ): Promise<CollectionFeaturedItem[]> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong')
      }, FakerHelper.loadingTimout())
    })
  }

  deleteFeaturedItems(_collectionIdOrAlias: number | string): Promise<void> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong')
      }, FakerHelper.loadingTimout())
    })
  }

  deleteFeaturedItem(_featuredItemId: number): Promise<void> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Something went wrong')
      }, FakerHelper.loadingTimout())
    })
  }
}
