import { AllowedStorageDrivers } from '../models/AllowedStorageDrivers'
import { CollectionRepository } from '../repositories/CollectionRepository'

export async function getCollectionAllowedStorageDrivers(
  collectionRepository: CollectionRepository,
  collectionIdOrAlias: number | string
): Promise<AllowedStorageDrivers> {
  return collectionRepository.getAllowedStorageDrivers(collectionIdOrAlias)
}
