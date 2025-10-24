import { CollectionRepository } from '../repositories/CollectionRepository'

export async function linkCollection(
  collectionRepository: CollectionRepository,
  linkedCollectionIdOrAlias: number | string,
  linkingCollectionIdOrAlias: number | string
): Promise<void> {
  return collectionRepository.link(linkedCollectionIdOrAlias, linkingCollectionIdOrAlias)
}
