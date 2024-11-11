import { WriteError } from '@iqss/dataverse-client-javascript'
import { CollectionRepository } from '../repositories/CollectionRepository'
import { CollectionDTO } from './DTOs/CollectionDTO'

export async function editCollection(
  collectionRepository: CollectionRepository,
  collectionId: string,
  updatedCollection: CollectionDTO
): Promise<void> {
  return collectionRepository.edit(collectionId, updatedCollection).catch((error: WriteError) => {
    throw error
  })
}
