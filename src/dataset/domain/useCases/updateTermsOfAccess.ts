import { TermsOfAccess } from '../models/Dataset'
import { DatasetRepository } from '../repositories/DatasetRepository'

export function updateTermsOfAccess(
  datasetRepository: DatasetRepository,
  datasetId: string | number,
  termsOfAccess: TermsOfAccess
): Promise<void> {
  return datasetRepository.updateTermsOfAccess(datasetId, termsOfAccess)
}
