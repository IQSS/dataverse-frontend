import { CollectionRepository } from '../repositories/CollectionRepository'
import { CollectionItemSubset } from '../models/CollectionItemSubset'

export async function getMyDataCollectionItems(
  collectionRepository: CollectionRepository,
  roleIds: number[],
  collectionItemTypes: string[],
  publicationStatuses: string[],
  limit?: number,
  selectedPage?: number,
  searchText?: string
): Promise<CollectionItemSubset> {
  return collectionRepository
    .getMyDataItems(
      roleIds,
      collectionItemTypes,
      publicationStatuses,
      limit,
      selectedPage,
      searchText
    )
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
