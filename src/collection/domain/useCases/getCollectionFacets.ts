import { CollectionFacet } from '../models/CollectionFacet'
import { CollectionRepository } from '../repositories/CollectionRepository'

export async function getCollectionFacets(
  collectionRepository: CollectionRepository,
  collectionIdOrAlias: number | string
): Promise<CollectionFacet[]> {
  return collectionRepository.getFacets(collectionIdOrAlias).catch((error: Error) => {
    throw new Error(error.message)
  })
}
