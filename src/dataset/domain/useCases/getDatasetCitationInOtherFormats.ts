import { FormattedCitation } from '../models/FormattedCitation'
import { DatasetRepository } from '../repositories/DatasetRepository'
import { CitationFormat } from './DTOs/DatasetDTO'

export function getDatasetCitationInOtherFormats(
  datasetRepository: DatasetRepository,
  datasetId: string,
  version: string,
  format: CitationFormat
): Promise<FormattedCitation> {
  return datasetRepository.getDatasetCitationInOtherFormats(datasetId, version, format)
}
