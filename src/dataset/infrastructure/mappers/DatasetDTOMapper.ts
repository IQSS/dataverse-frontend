import { DatasetDTO } from '../../domain/useCases/DTOs/DatasetDTO'
import {
  DatasetDTO as JSDatasetDTO,
  DatasetMetadataBlockValuesDTO as JSMetadataBlocksDTO
} from '@iqss/dataverse-client-javascript'
import { defaultLicense } from '../../domain/models/Dataset'

export class DatasetDTOMapper {
  public static toJSDatasetDTO(dataset: DatasetDTO): JSDatasetDTO {
    return {
      license: defaultLicense,
      metadataBlockValues: dataset.metadataBlocks as JSMetadataBlocksDTO[]
    }
  }
}
