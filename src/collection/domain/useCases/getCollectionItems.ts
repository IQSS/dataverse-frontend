import { CollectionRepository } from '../repositories/CollectionRepository'
import { CollectionItemsPaginationInfo } from '../models/CollectionItemsPaginationInfo'
import { CollectionItemSubset } from '../models/CollectionItemSubset'
import { TemporarySearchCriteria } from '../../../sections/collection/collection-items-panel/useGetAccumulatedItems'

export async function getCollectionItems(
  collectionRepository: CollectionRepository,
  collectionId: string,
  paginationInfo: CollectionItemsPaginationInfo,
  searchCriteria: TemporarySearchCriteria
): Promise<CollectionItemSubset> {
  return collectionRepository
    .getItems(collectionId, paginationInfo, searchCriteria)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
