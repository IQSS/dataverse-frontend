import { FileRepository } from '../repositories/FileRepository'
import { FixityAlgorithm } from '../models/FixityAlgorithm'

export async function getFixityAlgorithm(repository: FileRepository): Promise<FixityAlgorithm> {
  return repository.getFixityAlgorithm().catch((error: Error) => {
    throw error
  })
}
