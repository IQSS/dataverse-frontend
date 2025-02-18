import { ContactRepository } from '../repositories/ContactRepository'
import { WriteError } from '@iqss/dataverse-client-javascript'

export async function getCollectionName(
  ContactRepository: ContactRepository,
  collectionAlias: string
): Promise<string> {
  return ContactRepository.getCollectionName(collectionAlias).catch((error: WriteError) => {
    throw new Error(error.message)
  })
}
