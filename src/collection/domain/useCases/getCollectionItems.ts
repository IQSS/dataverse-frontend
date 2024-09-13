import { CollectionRepository } from '../repositories/CollectionRepository'
import { CollectionItemsPaginationInfo } from '../models/CollectionItemsPaginationInfo'
import { CollectionItemSubset } from '../models/CollectionItemSubset'

export async function getCollectionItems(
  collectionRepository: CollectionRepository,
  collectionId: string,
  paginationInfo: CollectionItemsPaginationInfo
): Promise<CollectionItemSubset> {
  return collectionRepository.getItems(collectionId, paginationInfo).catch((error: Error) => {
    throw new Error(error.message)
  })
}
