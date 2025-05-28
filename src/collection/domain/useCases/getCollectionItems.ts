import { CollectionRepository } from '../repositories/CollectionRepository'
import { CollectionItemsPaginationInfo } from '../models/CollectionItemsPaginationInfo'
import { CollectionItemSubset } from '../models/CollectionItemSubset'
import { CollectionSearchCriteria } from '../models/CollectionSearchCriteria'

export async function getCollectionItems(
  collectionRepository: CollectionRepository,
  collectionId: string,
  paginationInfo: CollectionItemsPaginationInfo,
  searchCriteria: CollectionSearchCriteria,
  searchService?: string
): Promise<CollectionItemSubset> {
  return collectionRepository
    .getItems(collectionId, paginationInfo, searchCriteria, searchService)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
