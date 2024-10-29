import { Collection } from '../models/Collection'
import { CollectionRepository } from '../repositories/CollectionRepository'

export async function getCollectionById(
  collectionRepository: CollectionRepository,
  id?: string
): Promise<Collection> {
  return collectionRepository.getById(id).catch((error: Error) => {
    throw new Error(error.message)
  })
}
