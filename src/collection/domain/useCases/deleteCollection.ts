import { WriteError } from '@iqss/dataverse-client-javascript'
import { CollectionRepository } from '../repositories/CollectionRepository'

export function deleteCollection(
  collectionRepository: CollectionRepository,
  collectionIdOrAlias: number | string
): Promise<void> {
  return collectionRepository.delete(collectionIdOrAlias).catch((error: WriteError | unknown) => {
    throw error
  })
}
