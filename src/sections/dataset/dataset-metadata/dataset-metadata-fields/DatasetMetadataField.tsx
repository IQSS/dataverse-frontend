import { DatasetMetadataField as DatasetMetadataFieldModel } from '../../../../dataset/domain/models/Dataset'
import { Col, Row, Tooltip } from 'dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { DatasetMetadataSubFields } from './DatasetMetadataSubFields'
import { MetadataBlockName } from '../../../../dataset/domain/models/Dataset'
import { MarkdownComponent } from '../../markdown/MarkdownComponent'

interface DatasetMetadataFieldProps {
  metadataBlockName: MetadataBlockName
  metadataFieldName: string
  metadataField: DatasetMetadataFieldModel
}

export function DatasetMetadataField({
  metadataBlockName,
  metadataFieldName,
  metadataField
}: DatasetMetadataFieldProps) {
  const { t } = useTranslation(`${metadataBlockName}`)
  const completeFieldName = `${metadataBlockName}.datasetField.${metadataFieldName}`

  return (
    <Row>
      <Col sm={3}>
        <strong>{t(`${completeFieldName}.name`)} </strong>
        <Tooltip placement="right" message={t(`${completeFieldName}.description`)}></Tooltip>
      </Col>
      <Col>
        {typeof metadataField === 'string' ? (
          <MarkdownComponent markdown={metadataField} />
        ) : (
          <DatasetMetadataSubFields
            fieldName={metadataFieldName}
            metadataSubFields={metadataField}
          />
        )}
      </Col>
    </Row>
  )
}
