import { CollectionRepository } from '../repositories/CollectionRepository'
import { CollectionDTO } from './DTOs/CollectionDTO'

export function createCollection(
  collectionRepository: CollectionRepository,
  collection: CollectionDTO,
  collectionId?: string
): Promise<number> {
  return collectionRepository.create(collection, collectionId).catch((error: Error) => {
    throw new Error(error.message)
  })
}
