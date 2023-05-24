import { Accordion } from 'dataverse-design-system'
import { DatasetMetadataBlock as DatasetMetadataBlockModel } from '../../../dataset/domain/models/Dataset'
import { DatasetMetadataBlock } from './dataset-metadata-block/DatasetMetadataBlock'

interface DatasetMetadataProps {
  metadataBlocks: DatasetMetadataBlockModel[]
}

export function DatasetMetadata({ metadataBlocks }: DatasetMetadataProps) {
  return (
    <Accordion defaultActiveKey={['0']} alwaysOpen>
      {metadataBlocks.map((metadataBlock, index) => (
        <Accordion.Item key={`${metadataBlock.name}-${index}`} eventKey={index.toString()}>
          <DatasetMetadataBlock metadataBlock={metadataBlock} />
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
