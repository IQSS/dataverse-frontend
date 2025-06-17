import { CollectionRepository } from '../repositories/CollectionRepository'
import { MyDataCollectionItemSubset } from '../models/MyDataCollectionItemSubset'
import { PublicationStatus } from '../../../shared/core/domain/models/PublicationStatus'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'

export async function getMyDataCollectionItems(
  collectionRepository: CollectionRepository,
  roleIds: number[],
  collectionItemTypes: CollectionItemType[],
  publicationStatuses: PublicationStatus[],
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
          publicationStatusCounts: [
            {
              publicationStatus: PublicationStatus.Unpublished,
              count: 0
            },
            {
              publicationStatus: PublicationStatus.Published,
              count: 0
            },
            {
              publicationStatus: PublicationStatus.Draft,
              count: 0
            },
            {
              publicationStatus: PublicationStatus.InReview,
              count: 0
            },
            {
              publicationStatus: PublicationStatus.Deaccessioned,
              count: 0
            }
          ],
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
