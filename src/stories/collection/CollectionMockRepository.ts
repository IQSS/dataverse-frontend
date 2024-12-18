import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { CollectionMother } from '../../../tests/component/collection/domain/models/CollectionMother'
import { Collection } from '../../collection/domain/models/Collection'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'
import { CollectionDTO } from '../../collection/domain/useCases/DTOs/CollectionDTO'
import { CollectionFacet } from '../../collection/domain/models/CollectionFacet'
import { CollectionFacetMother } from '../../../tests/component/collection/domain/models/CollectionFacetMother'
import { CollectionUserPermissions } from '../../collection/domain/models/CollectionUserPermissions'
import { CollectionItemsPaginationInfo } from '@/collection/domain/models/CollectionItemsPaginationInfo'
import { CollectionItemSubset } from '@/collection/domain/models/CollectionItemSubset'
import { CollectionSearchCriteria } from '@/collection/domain/models/CollectionSearchCriteria'
import { CollectionItemsMother } from '../../../tests/component/collection/domain/models/CollectionItemsMother'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'

export class CollectionMockRepository implements CollectionRepository {
  getById(_id?: string): Promise<Collection> {
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

  getFacets(_collectionIdOrAlias: number | string): Promise<CollectionFacet[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(CollectionFacetMother.createFacets())
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

  getItems(
    _collectionId: string,
    paginationInfo: CollectionItemsPaginationInfo,
    searchCriteria?: CollectionSearchCriteria
  ): Promise<CollectionItemSubset> {
    const numberOfCollections = Math.floor(paginationInfo.pageSize / 3)
    const numberOfDatasets = Math.floor(paginationInfo.pageSize / 3)
    const numberOfFiles = paginationInfo.pageSize - numberOfCollections - numberOfDatasets

    const items = CollectionItemsMother.createItems({
      numberOfCollections,
      numberOfDatasets,
      numberOfFiles
    })

    const isDefaultSelected =
      searchCriteria?.itemTypes?.length === 2 &&
      searchCriteria?.itemTypes?.includes(CollectionItemType.COLLECTION) &&
      searchCriteria?.itemTypes?.includes(CollectionItemType.DATASET)

    const filteredByTypeItems = items.filter((item) =>
      searchCriteria?.itemTypes?.includes(item.type)
    )

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          items: filteredByTypeItems,
          totalItemCount: isDefaultSelected ? 6 : 200 // This is a fake number, its big so we can always scroll to load more items for the story
        })
      }, FakerHelper.loadingTimout())
    })
  }

  publish(_persistentId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }

  edit(_collectionIdOrAlias: string, _updatedCollection: CollectionDTO): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }

  getFeaturedItems(_collectionIdOrAlias?: number | string): Promise<CollectionFeaturedItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(CollectionFeaturedItemMother.createFeaturedItems())
      })
    })
  }
}
