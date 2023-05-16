import { Accordion } from 'dataverse-design-system'
import { DatasetMetadataBlock as DatasetMetadataBlockModel } from '../../../dataset/domain/models/Dataset'
import { DatasetMetadataFields } from './dataset-metadata-fields/DatasetMetadataFields'
import { useTranslation } from 'react-i18next'

interface DatasetMetadataProps {
  metadataBlocks: DatasetMetadataBlockModel[]
}

export function DatasetMetadata({ metadataBlocks }: DatasetMetadataProps) {
  const allKeys = metadataBlocks.map((_, index) => index.toString())

  return (
    <Accordion defaultActiveKey={allKeys} alwaysOpen>
      {metadataBlocks.map((metadataBlock, index) => (
        <Accordion.Item key={`${metadataBlock.name}-${index}`} eventKey={index.toString()}>
          <DatasetMetadataBlock metadataBlock={metadataBlock} />
        </Accordion.Item>
      ))}
    </Accordion>
  )
}

interface DatasetMetadataBlockProps {
  metadataBlock: DatasetMetadataBlockModel
}

function DatasetMetadataBlock({ metadataBlock }: DatasetMetadataBlockProps) {
  const { t } = useTranslation(metadataBlock.name)

  return (
    <>
      <Accordion.Header>{t(`${metadataBlock.name}.name`)}</Accordion.Header>
      <Accordion.Body>
        <DatasetMetadataFields
          metadataBlockName={metadataBlock.name}
          metadataFields={metadataBlock.fields}
        />
      </Accordion.Body>
    </>
  )
}
