import { DatasetMetadataFieldValue as DatasetMetadataFieldValueModel } from '../../../../dataset/domain/models/Dataset'
import { Col, Row } from '@iqss/dataverse-design-system'
import { MetadataBlockName } from '../../../../dataset/domain/models/Dataset'
import { DatasetMetadataFieldValue } from './DatasetMetadataFieldValue'
import { DatasetMetadataFieldTitle } from './DatasetMetadataFieldTitle'
import { DatasetMetadataFieldTip } from './DatasetMetadataFieldTip'
import { MetadataBlockInfoDisplayFormat } from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'

interface DatasetMetadataFieldProps {
  metadataBlockName: MetadataBlockName
  metadataFieldName: string
  metadataFieldValue: DatasetMetadataFieldValueModel
  metadataBlockDisplayFormatInfo: MetadataBlockInfoDisplayFormat
}

export function DatasetMetadataField({
  metadataBlockName,
  metadataFieldName,
  metadataFieldValue,
  metadataBlockDisplayFormatInfo
}: DatasetMetadataFieldProps) {
  return (
    <Row>
      <Col md={3}>
        <DatasetMetadataFieldTitle
          metadataBlockName={metadataBlockName}
          metadataFieldName={metadataFieldName}
        />
      </Col>
      <Col md={9} className="pt-1 pt-md-0">
        <DatasetMetadataFieldTip
          metadataBlockName={metadataBlockName}
          metadataFieldName={metadataFieldName}
        />
        <DatasetMetadataFieldValue
          metadataBlockName={metadataBlockName}
          metadataFieldName={metadataFieldName}
          metadataFieldValue={metadataFieldValue}
          metadataBlockDisplayFormatInfo={metadataBlockDisplayFormatInfo}
        />
      </Col>
    </Row>
  )
}
