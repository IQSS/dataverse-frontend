import { CollectionRepository } from '../repositories/CollectionRepository'

export async function setCollectionDriver(
  collectionRepository: CollectionRepository,
  collectionIdOrAlias: number | string,
  driverLabel: string
): Promise<string> {
  return collectionRepository.setStorageDriver(collectionIdOrAlias, driverLabel)
}
