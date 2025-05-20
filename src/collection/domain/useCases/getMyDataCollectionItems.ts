import { CollectionRepository } from '../repositories/CollectionRepository'
import { CollectionItemSubset } from '../models/CollectionItemSubset'

export async function getMyDataCollectionItems(
  collectionRepository: CollectionRepository,
  roleIds: number[],
  collectionItemTypes: string[],
  publicationStatuses: string[],
  limit?: number,
  selectedPage?: number,
  searchText?: string,
  otherUserName?: string
): Promise<CollectionItemSubset> {
  return collectionRepository
    .getMyDataItems(
      roleIds,
      collectionItemTypes,
      publicationStatuses,
      limit,
      selectedPage,
      searchText,
      otherUserName
    )
    .catch((error) => {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      if (
        errorMessage.includes('no results') ||
        errorMessage.includes('nothing was found') ||
        errorMessage.includes('No user found')
      ) {
        return {
          items: [],
          facets: [],
          totalItemCount: 0
        }
      }
      throw new Error(error instanceof Error ? error.message : 'Unknown error')
    })
}
