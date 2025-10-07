import { DataverseInfoRepository } from '../repositories/DataverseInfoRepository'
import { DatasetMetadataExportFormats } from '../models/DatasetMetadataExportFormats'

export function getAvailableDatasetMetadataExportFormats(
  dataverseInfoRepository: DataverseInfoRepository
): Promise<DatasetMetadataExportFormats> {
  return dataverseInfoRepository.getAvailableDatasetMetadataExportFormats()
}
