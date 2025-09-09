import { Accordion } from '@iqss/dataverse-design-system'
import {
  Dataset,
  DatasetPublishingStatus,
  MetadataBlockName
} from '../../../dataset/domain/models/Dataset'
import { DatasetMetadataBlock } from './dataset-metadata-block/DatasetMetadataBlock'
import { MetadataBlockInfoRepository } from '../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { ExportMetadataDropdown } from './export-metadata-dropdown/ExportMetadataDropdown'

interface DatasetMetadataProps {
  dataset: Dataset
  anonymizedView: boolean
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  dataverseInfoRepository: DataverseInfoRepository
}

export function DatasetMetadata({
  dataset,
  anonymizedView,
  metadataBlockInfoRepository,
  dataverseInfoRepository
}: DatasetMetadataProps) {
  return (
    <>
      <ExportMetadataDropdown
        datasetPersistentId={dataset.persistentId}
        anonymizedView={anonymizedView}
        datasetIsReleased={dataset.version.someDatasetVersionHasBeenReleased}
        datasetIsDeaccessioned={
          dataset.version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED
        }
        canUpdateDataset={dataset.permissions?.canUpdateDataset}
        dataverseInfoRepository={dataverseInfoRepository}
      />
      <Accordion defaultActiveKey={['0']} alwaysOpen>
        {dataset.metadataBlocks.map((metadataBlock, index) => {
          metadataBlock.fields =
            metadataBlock.name === MetadataBlockName.CITATION
              ? { persistentId: dataset.persistentId, ...metadataBlock.fields }
              : metadataBlock.fields

          // If fields are empty, skip rendering the block
          if (Object.keys(metadataBlock.fields).length === 0) {
            return null
          }

          return (
            <Accordion.Item key={`${metadataBlock.name}-${index}`} eventKey={index.toString()}>
              <DatasetMetadataBlock
                metadataBlock={metadataBlock}
                metadataBlockInfoRepository={metadataBlockInfoRepository}
              />
            </Accordion.Item>
          )
        })}
      </Accordion>
    </>
  )
}
