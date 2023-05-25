import { Dataset as JSDataset } from 'js-dataverse'
import { DatasetVersionState as JSDatasetVersionState } from 'js-dataverse/dist/datasets/domain/models/Dataset'
import { Dataset, DatasetStatus } from '../../domain/models/Dataset'

export class DatasetMapper {
  static toModel(jsDataset: JSDataset): Dataset {
    DatasetMapper.validateJsDataset(jsDataset)

    return new Dataset.Builder(
      jsDataset.persistentId,
      jsDataset.metadataBlocks[0].fields.title as string,
      jsDataset.versionInfo,
      DatasetMapper.toStatus(jsDataset.versionInfo.state),
      [],
      jsDataset.license,
      []
    )
  }

  static validateJsDataset(jsDataset: JSDataset): void {
    if (typeof jsDataset.metadataBlocks[0].fields.title !== 'string') {
      throw new Error('Dataset title is not a string')
    }
  }

  static toStatus(jsDatasetVersionState: JSDatasetVersionState): DatasetStatus {
    switch (jsDatasetVersionState) {
      case JSDatasetVersionState.DRAFT:
        return DatasetStatus.DRAFT
      case JSDatasetVersionState.DEACCESSIONED:
        return DatasetStatus.DEACCESSIONED
      case JSDatasetVersionState.RELEASED:
        return DatasetStatus.RELEASED
      default:
        return DatasetStatus.DRAFT
    }
  }
}
