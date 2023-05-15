import {
  DatasetMetadataField as DatasetMetadataFieldModel,
  DatasetMetadataSubField
} from '../../../../dataset/domain/models/Dataset'
import { Col, Row, Tooltip } from 'dataverse-design-system'

interface DatasetMetadataFieldProps {
  metadataField: DatasetMetadataFieldModel
}

export function DatasetMetadataField({ metadataField }: DatasetMetadataFieldProps) {
  return (
    <Row>
      <Col sm={3}>
        <strong>{metadataField.title} </strong>
        <Tooltip placement="right" message={metadataField.description}></Tooltip>
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
