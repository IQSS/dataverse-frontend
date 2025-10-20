import { CollectionRepository } from '../repositories/CollectionRepository'
import { CollectionSummary } from '../models/CollectionSummary'

export type LinkingObjectType = 'collection' | 'dataset'

export async function getCollectionsForLinking(
  collectionRepository: CollectionRepository,
  objectType: LinkingObjectType,
  id: number | string,
  searchTerm?: string
): Promise<CollectionSummary[]> {
  return collectionRepository.getForLinking(objectType, id, searchTerm)
}
