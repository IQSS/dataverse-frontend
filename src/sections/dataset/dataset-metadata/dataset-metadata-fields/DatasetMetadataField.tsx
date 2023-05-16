import {
  DatasetMetadataField as DatasetMetadataFieldModel,
  DatasetMetadataSubField
} from '../../../../dataset/domain/models/Dataset'
import { Col, Row, Tooltip } from 'dataverse-design-system'
import { useTranslation } from 'react-i18next'

interface DatasetMetadataFieldProps {
  metadataField: DatasetMetadataFieldModel
}

export function DatasetMetadataField({ metadataField }: DatasetMetadataFieldProps) {
  const { t } = useTranslation('datasetMetadata')

  return (
    <Row>
      <Col sm={3}>
        <strong>{t(metadataField.title)} </strong>
        <Tooltip placement="right" message={t(metadataField.description)}></Tooltip>
      </Col>
      <Col>
        {typeof metadataField.value === 'string' ? (
          <span>{metadataField.value}</span>
        ) : (
          <DatasetMetadataSubFields metadataSubFields={metadataField.value} />
        )}
      </Col>
    </Row>
  )
}

interface DatasetMetadataSubFieldsProps {
  metadataSubFields: DatasetMetadataSubField[]
}
function DatasetMetadataSubFields({ metadataSubFields }: DatasetMetadataSubFieldsProps) {
  return (
    <>
      {metadataSubFields.map((metadataSubField, index) => (
        <div key={`metadata-subfield-${index}`}>
          {Object.values(metadataSubField).map((value, index) => (
            <span key={`${value}-${index}`}>{value} </span>
          ))}
          <br />
        </div>
      ))}
    </>
  )
}
