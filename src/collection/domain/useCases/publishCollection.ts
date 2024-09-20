import { CollectionRepository } from '../repositories/CollectionRepository'

export function publishCollection(
  collectionRepository: CollectionRepository,
  collectionId: number | string
): Promise<void> {
  return collectionRepository.publish(collectionId).catch((error: Error) => {
    throw new Error(error.message)
  })
}
