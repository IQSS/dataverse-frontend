import {
  DatasetMetadataBlock as DatasetMetadataBlockModel
  // MetadataBlockName
} from '../../../dataset/domain/models/Dataset'
//import { DatasetMetadataBlock } from '../dataset-metadata/DatasetMetadataBlock'
import { MetadataBlockInfoRepository } from '../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'

interface DatasetTermsProps {
  persistentId: string
  metadataBlocks: DatasetMetadataBlockModel[]
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

export function DatasetTerms({
  persistentId,
  metadataBlocks,
  metadataBlockInfoRepository
}: DatasetTermsProps) {
  return null
  /*
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
    </Accordion>*/
}
