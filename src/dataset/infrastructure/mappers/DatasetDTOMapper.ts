import { DatasetDTO } from '../../domain/useCases/DTOs/DatasetDTO'
import {
  DatasetDTO as JSDatasetDTO,
  DatasetMetadataBlockValuesDTO as JSMetadataBlocksDTO
} from '@iqss/dataverse-client-javascript'

export class DatasetDTOMapper {
  public static toJSDatasetDTO(dataset: DatasetDTO): JSDatasetDTO {
    return {
      metadataBlockValues: dataset.metadataBlocks as JSMetadataBlocksDTO[]
    }
  }
}
