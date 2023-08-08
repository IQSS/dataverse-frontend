import {
  ANONYMIZED_FIELD_VALUE,
  DatasetMetadataFieldValue as DatasetMetadataFieldValueModel,
  MetadataBlockName
} from '../../../../dataset/domain/models/Dataset'
import { useAnonymized } from '../../anonymized/AnonymizedContext'
import { useTranslation } from 'react-i18next'
import { DatasetMetadataFieldValueFormatted } from './DatasetMetadataFieldValueFormatted'

interface DatasetMetadataFieldValueProps {
  metadataBlockName: MetadataBlockName
  metadataFieldName: string
  metadataFieldValue: DatasetMetadataFieldValueModel
}

export function DatasetMetadataFieldValue({
  metadataBlockName,
  metadataFieldName,
  metadataFieldValue
}: DatasetMetadataFieldValueProps) {
  const { anonymizedView } = useAnonymized()
  const isAnonymizedField = anonymizedView && metadataFieldValue == ANONYMIZED_FIELD_VALUE
  if (isAnonymizedField) {
    return <AnonymizedFieldValue />
  }

  return (
    <DatasetMetadataFieldValueFormatted
      metadataBlockName={metadataBlockName}
      metadataFieldName={metadataFieldName}
      metadataFieldValue={metadataFieldValue}
    />
  )
}

const AnonymizedFieldValue = () => {
  const { t } = useTranslation('dataset')
  return <p>{t('anonymizedFieldValue')}</p>
}
