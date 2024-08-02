import { Accordion } from '@iqss/dataverse-design-system'
import {
  DatasetMetadataBlock as DatasetMetadataBlockModel,
  MetadataBlockName
} from '../../../dataset/domain/models/Dataset'
import { DatasetMetadataBlock } from './dataset-metadata-block/DatasetMetadataBlock'
import { MetadataBlockInfoRepository } from '../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'

interface DatasetMetadataProps {
  persistentId: string
  metadataBlocks: DatasetMetadataBlockModel[]
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

export function DatasetMetadata({
  persistentId,
  metadataBlocks,
  metadataBlockInfoRepository
}: DatasetMetadataProps) {
  return (
    <Accordion defaultActiveKey={['0']} alwaysOpen>
      {metadataBlocks.map((metadataBlock, index) => {
        metadataBlock.fields =
          metadataBlock.name === MetadataBlockName.CITATION
            ? { persistentId: persistentId, ...metadataBlock.fields }
            : metadataBlock.fields

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
  )
}
