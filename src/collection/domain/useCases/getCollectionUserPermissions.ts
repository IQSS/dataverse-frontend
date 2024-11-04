import { CollectionRepository } from '../repositories/CollectionRepository'
import { CollectionUserPermissions } from '../models/CollectionUserPermissions'

export function getCollectionUserPermissions(
  collectionRepository: CollectionRepository,
  collectionIdOrAlias?: number | string
): Promise<CollectionUserPermissions> {
  return collectionRepository.getUserPermissions(collectionIdOrAlias).catch((error: Error) => {
    throw new Error(error.message)
  })
}
