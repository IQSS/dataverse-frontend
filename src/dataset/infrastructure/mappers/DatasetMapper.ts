import {
  Dataset as JSDataset,
  DatasetMetadataBlock as JSDatasetMetadataBlock
} from '@IQSS/dataverse-client-javascript'
import { DatasetVersionState as JSDatasetVersionState } from '@IQSS/dataverse-client-javascript/dist/datasets/domain/models/Dataset'
import {
  DatasetCitation,
  Dataset,
  DatasetStatus,
  MetadataBlockName
} from '../../domain/models/Dataset'

export class DatasetMapper {
  static toModel(jsDataset: JSDataset): Dataset {
    return new Dataset.Builder(
      jsDataset.persistentId,
      DatasetMapper.toTitle(jsDataset.metadataBlocks),
      jsDataset.versionInfo,
      DatasetMapper.toStatus(jsDataset.versionInfo.state),
      DatasetMapper.toCitation(),
      [],
      jsDataset.license,
      []
    )
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

  static toTitle(jsDatasetMetadataBlocks: JSDatasetMetadataBlock[]): string {
    const citationFields = jsDatasetMetadataBlocks.find(
      (metadataBlock) => metadataBlock.name === MetadataBlockName.CITATION
    )?.fields

    if (citationFields && typeof citationFields.title === 'string') {
      return citationFields.title
    }

    throw new Error('Dataset title not found')
  }

  static toCitation(): DatasetCitation {
    // TODO: Implement
    return {
      citationText: '',
      url: '',
      publisher: ''
    }
  }

  // static toMetadataBlocks(
  //   jsDatasetMetadataBlocks: JSDatasetMetadataBlock[]
  // ): DatasetMetadataBlock[] {
  //   return jsDatasetMetadataBlocks.map((jsDatasetMetadataBlock) => {
  //     return {
  //       name: DatasetMapper.toMetadataBlockName(jsDatasetMetadataBlock.name),
  //       fields: DatasetMapper.toMetadataBlockName(jsDatasetMetadataBlock.name)
  //     }
  //   })
  // }
  //
  // static toMetadataBlockName(jsDatasetMetadataBlockName: string): MetadataBlockName {
  //   const metadataBlockNameKey = Object.values(MetadataBlockName).find((metadataBlockNameKey) => {
  //     return metadataBlockNameKey === jsDatasetMetadataBlockName
  //   })
  //
  //   if (metadataBlockNameKey === undefined) {
  //     throw new Error('Incorrect Metadata block name key')
  //   }
  //
  //   return metadataBlockNameKey
  // }
}
