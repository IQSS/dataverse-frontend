import { Accordion } from 'dataverse-design-system'
import { DatasetMetadataBlock } from '../../../dataset/domain/models/Dataset'
import { DatasetMetadataFields } from './dataset-metadata-fields/DatasetMetadataFields'

interface DatasetMetadataProps {
  metadataBlocks: DatasetMetadataBlock[]
}
export function DatasetMetadata({ metadataBlocks }: DatasetMetadataProps) {
  return (
    <Accordion defaultActiveKey={['0']} alwaysOpen>
      {metadataBlocks.map((metadataBlock, index) => (
        <Accordion.Item key={`${metadataBlock.title}-${index}`} eventKey={index.toString()}>
          <Accordion.Header>{metadataBlock.title}</Accordion.Header>
          <Accordion.Body>
            <DatasetMetadataFields metadataFields={metadataBlock.fields} />
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
