import { CollectionRepository } from '../repositories/CollectionRepository'
import { MyDataCollectionItemSubset } from '../models/MyDataCollectionItemSubset'

export async function getMyDataCollectionItems(
  collectionRepository: CollectionRepository,
  roleIds: number[],
  collectionItemTypes: string[],
  publicationStatuses: string[],
  limit?: number,
  selectedPage?: number,
  searchText?: string,
  otherUserName?: string
): Promise<MyDataCollectionItemSubset> {
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
    .catch((error: Error | unknown) => {
      if (
        error instanceof Error &&
        (error.message.includes('no results') ||
          error.message.includes('nothing was found') ||
          error.message.includes('No user found'))
      ) {
        return {
          items: [],
          publicationStatusCounts: [],
          totalItemCount: 0,
          countPerObjectType: {
            collections: 0,
            datasets: 0,
            files: 0
          }
        }
      }

      throw error
    })
}
