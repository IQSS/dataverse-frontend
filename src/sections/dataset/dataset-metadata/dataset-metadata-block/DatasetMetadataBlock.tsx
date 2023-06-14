import { DatasetMetadataBlock as DatasetMetadataBlockModel } from '../../../../dataset/domain/models/Dataset'
import { useTranslation } from 'react-i18next'
import { Accordion } from 'dataverse-design-system'
import { DatasetMetadataFields } from '../dataset-metadata-fields/DatasetMetadataFields'

interface DatasetMetadataBlockProps {
  metadataBlock: DatasetMetadataBlockModel
}

export function DatasetMetadataBlock({ metadataBlock }: DatasetMetadataBlockProps) {
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
