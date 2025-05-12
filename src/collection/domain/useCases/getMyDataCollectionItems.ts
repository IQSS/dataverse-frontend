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
  try {
    const result = await collectionRepository.getMyDataItems(
      roleIds,
      collectionItemTypes,
      publicationStatuses,
      limit,
      selectedPage,
      searchText
    )
    console.log('getMyDataCollectionItems result:', result)
    return result
  } catch (error: Error | unknown) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error')
  }
}
