import { CollectionRepository } from '../repositories/CollectionRepository'

export function publishCollection(
  collectionRepository: CollectionRepository,
  id: string
): Promise<void> {
  return collectionRepository.publish(id).catch((error: Error) => {
    throw new Error(error.message)
  })
}
