import { WriteError } from '@iqss/dataverse-client-javascript'
import { CollectionRepository } from '../repositories/CollectionRepository'
import { CollectionDTO } from './DTOs/CollectionDTO'

export function createCollection(
  collectionRepository: CollectionRepository,
  collection: CollectionDTO,
  hostCollection?: string
): Promise<number> {
  return collectionRepository.create(collection, hostCollection).catch((error: WriteError) => {
    throw error
  })
}
