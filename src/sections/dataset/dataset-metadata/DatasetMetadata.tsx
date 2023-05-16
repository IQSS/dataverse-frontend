import { Accordion } from 'dataverse-design-system'
import { DatasetMetadataBlock } from '../../../dataset/domain/models/Dataset'
import { DatasetMetadataFields } from './dataset-metadata-fields/DatasetMetadataFields'
import { useTranslation } from 'react-i18next'

interface DatasetMetadataProps {
  metadataBlocks: DatasetMetadataBlock[]
}

export function DatasetMetadata({ metadataBlocks }: DatasetMetadataProps) {
  const allKeys = metadataBlocks.map((_, index) => index.toString())
  const { t } = useTranslation('datasetMetadata')

  return (
    <Accordion defaultActiveKey={allKeys} alwaysOpen>
      {metadataBlocks.map((metadataBlock, index) => (
        <Accordion.Item key={`${metadataBlock.title}-${index}`} eventKey={index.toString()}>
          <Accordion.Header>{t(metadataBlock.title)}</Accordion.Header>
          <Accordion.Body>
            <DatasetMetadataFields metadataFields={metadataBlock.fields} />
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
