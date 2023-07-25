import { DatasetMetadataFieldValue as DatasetMetadataFieldValueModel } from '../../../../dataset/domain/models/Dataset'
import { Col, Row } from '@iqss/dataverse-design-system'
import { MetadataBlockName } from '../../../../dataset/domain/models/Dataset'
import { DatasetMetadataFieldValue } from './DatasetMetadataFieldValue'
import { DatasetMetadataFieldTitle } from './DatasetMetadataFieldTitle'
import { DatasetMetadataFieldTip } from './DatasetMetadataFieldTip'

interface DatasetMetadataFieldProps {
  metadataBlockName: MetadataBlockName
  metadataFieldName: string
  metadataFieldValue: DatasetMetadataFieldValueModel
}

export function DatasetMetadataField({
  metadataBlockName,
  metadataFieldName,
  metadataFieldValue
}: DatasetMetadataFieldProps) {
  return (
    <Row>
      <Col sm={3}>
        <DatasetMetadataFieldTitle
          metadataBlockName={metadataBlockName}
          metadataFieldName={metadataFieldName}
        />
      </Col>
      <Col>
        <DatasetMetadataFieldTip
          metadataBlockName={metadataBlockName}
          metadataFieldName={metadataFieldName}
        />
        <DatasetMetadataFieldValue
          metadataFieldName={metadataFieldName}
          metadataFieldValue={metadataFieldValue}
        />
      </Col>
    </Row>
  )
}
