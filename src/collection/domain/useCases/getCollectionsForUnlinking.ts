import { CollectionRepository } from '../repositories/CollectionRepository'
import { CollectionSummary } from '../models/CollectionSummary'
import { LinkingObjectType } from './getCollectionsForLinking'

export async function getCollectionsForUnlinking(
  collectionRepository: CollectionRepository,
  objectType: LinkingObjectType,
  id: number | string,
  searchTerm?: string
): Promise<CollectionSummary[]> {
  return collectionRepository.getForUnlinking(objectType, id, searchTerm)
}
