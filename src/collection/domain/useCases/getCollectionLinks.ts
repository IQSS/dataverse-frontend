import { CollectionRepository } from '../repositories/CollectionRepository'
import { CollectionLinks } from '../models/CollectionLinks'

export async function getCollectionLinks(
  collectionRepository: CollectionRepository,
  collectionIdOrAlias: number | string
): Promise<CollectionLinks> {
  return collectionRepository.getLinks(collectionIdOrAlias)
}
