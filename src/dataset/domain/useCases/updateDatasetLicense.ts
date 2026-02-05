import { DatasetLicenseUpdateRequest } from '../models/DatasetLicenseUpdateRequest'
import { DatasetRepository } from '../repositories/DatasetRepository'

export function updateDatasetLicense(
  datasetRepository: DatasetRepository,
  datasetId: string | number,
  licenseUpdateRequest: DatasetLicenseUpdateRequest
): Promise<void> {
  return datasetRepository
    .updateDatasetLicense(datasetId, licenseUpdateRequest)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
