import { CollectionRepository } from '../repositories/CollectionRepository'
import { CollectionDTO } from './DTOs/CollectionDTO'

export function createCollection(
  collectionRepository: CollectionRepository,
  collection: CollectionDTO,
  hostCollection: string
): Promise<number> {
  return collectionRepository.create(collection, hostCollection)
}
