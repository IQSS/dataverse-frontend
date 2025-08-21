import { FormattedCitation, CitationFormat } from '../models/DatasetCitation'
import { DatasetRepository } from '../repositories/DatasetRepository'

export function getDatasetCitationInOtherFormats(
  datasetRepository: DatasetRepository,
  datasetId: string | number,
  version: string,
  format: CitationFormat
): Promise<FormattedCitation> {
  return datasetRepository.getDatasetCitationInOtherFormats(datasetId, version, format)
}
