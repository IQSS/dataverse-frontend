import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetUploadLimits } from '../models/DatasetUploadLimits'

export async function getDatasetUploadLimits(
  datasetId: string | number,
  datasetRepository: DatasetRepository
): Promise<DatasetUploadLimits> {
  return datasetRepository.getDatasetUploadLimits(datasetId)
}
