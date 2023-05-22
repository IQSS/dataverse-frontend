import {
  DatasetMetadataField as DatasetMetadataFieldModel,
  ANONYMIZED_FIELD_VALUE
} from '../../../../dataset/domain/models/Dataset'
import { Col, Row } from 'dataverse-design-system'
import { MetadataBlockName } from '../../../../dataset/domain/models/Dataset'
import { useAnonymized } from '../../anonymized/AnonymizedContext'
import { DatasetMetadataFieldValue } from './DatasetMetadataFieldValue'
import { DatasetMetadataFieldTitle } from './DatasetMetadataFieldTitle'
import { useTranslation } from 'react-i18next'

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
  const { anonymizedView } = useAnonymized()
  const isAnonymizedField = anonymizedView && metadataField == ANONYMIZED_FIELD_VALUE

  return (
    <Row>
      <Col sm={3}>
        <DatasetMetadataFieldTitle
          metadataBlockName={metadataBlockName}
          metadataFieldName={metadataFieldName}
        />
      </Col>
      <Col>
        {isAnonymizedField ? (
          <AnonymizedFieldValue />
        ) : (
          <DatasetMetadataFieldValue
            metadataFieldName={metadataFieldName}
            metadataField={metadataField}
          />
        )}
      </Col>
    </Row>
  )
}

const AnonymizedFieldValue = () => {
  const { t } = useTranslation('dataset')
  return <span>{t('anonymizedFieldValue')}</span>
}
