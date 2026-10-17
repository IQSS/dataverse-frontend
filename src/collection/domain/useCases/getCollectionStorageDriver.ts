import { StorageDriver } from '../models/StorageDriver'
import { CollectionRepository } from '../repositories/CollectionRepository'

export async function getCollectionStorageDriver(
  collectionRepository: CollectionRepository,
  collectionIdOrAlias: number | string,
  getEffective?: boolean
): Promise<StorageDriver | undefined> {
  return collectionRepository.getStorageDriver(collectionIdOrAlias, getEffective)
}
