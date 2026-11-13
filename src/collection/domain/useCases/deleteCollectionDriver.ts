import { CollectionRepository } from '../repositories/CollectionRepository'

export async function deleteCollectionDriver(
  collectionRepository: CollectionRepository,
  collectionIdOrAlias: number | string
): Promise<string> {
  return collectionRepository.deleteStorageDriver(collectionIdOrAlias)
}
