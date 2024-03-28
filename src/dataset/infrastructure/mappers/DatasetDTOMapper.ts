import { DatasetDTO } from '../../domain/useCases/DTOs/DatasetDTO'
import {
  NewDataset as JSDatasetDTO,
  NewDatasetMetadataBlockValues as JSMetadataBlocksDTO
} from '@iqss/dataverse-client-javascript'

export class DatasetDTOMapper {
  public static toJSDatasetDTO(dataset: DatasetDTO): JSDatasetDTO {
    return {
      metadataBlockValues: dataset.metadataBlocks as JSMetadataBlocksDTO[]
    }
  }
}
