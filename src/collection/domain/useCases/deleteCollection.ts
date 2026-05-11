import { CollectionRepository } from '../repositories/CollectionRepository'

export function deleteCollection(
  collectionRepository: CollectionRepository,
  collectionIdOrAlias: number | string
): Promise<void> {
  return collectionRepository.delete(collectionIdOrAlias)
}
