import { CollectionLinks } from '../models/CollectionLinks'
import { CollectionRepository } from '../repositories/CollectionRepository'

export async function getCollectionLinks(
  collectionRepository: CollectionRepository,
  collectionIdOrAlias: string | number
): Promise<CollectionLinks> {
  return collectionRepository.getLinks(collectionIdOrAlias)
}
