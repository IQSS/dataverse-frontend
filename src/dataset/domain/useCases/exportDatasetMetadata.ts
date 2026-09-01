import { ExportedDatasetMetadata } from '../models/ExportedDatasetMetadata'
import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetNotNumberedVersion } from '@iqss/dataverse-client-javascript'

export function exportDatasetMetadata(
  datasetRepository: DatasetRepository,
  datasetId: string | number,
  exporter: string,
  version?: DatasetNotNumberedVersion.LATEST_PUBLISHED | DatasetNotNumberedVersion.DRAFT
): Promise<ExportedDatasetMetadata> {
  return datasetRepository.exportDatasetMetadata(datasetId, exporter, version)
}
