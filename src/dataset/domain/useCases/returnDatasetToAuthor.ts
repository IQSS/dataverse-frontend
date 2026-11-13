import { DatasetRepository } from '../repositories/DatasetRepository'

export const RETURN_REASON_MAX_LENGTH = 2000

export function returnDatasetToAuthor(
  repository: DatasetRepository,
  datasetId: string | number,
  reason: string
): Promise<void> {
  if (!reason.trim() || reason.length > RETURN_REASON_MAX_LENGTH) {
    return Promise.reject(new Error('A reason between 1 and 2000 characters is required.'))
  }
  return repository.returnToAuthor(datasetId, reason.trim())
}
