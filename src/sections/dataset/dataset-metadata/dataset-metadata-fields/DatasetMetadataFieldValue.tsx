import {
  ANONYMIZED_FIELD_VALUE,
  DatasetMetadataFieldValue as DatasetMetadataFieldValueModel
} from '../../../../dataset/domain/models/Dataset'
import { useAnonymized } from '../../anonymized/AnonymizedContext'
import { useTranslation } from 'react-i18next'
import { DatasetMetadataFieldValueFormatted } from './DatasetMetadataFieldValueFormatted'
import { MetadataBlockInfoDisplayFormat } from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'

interface DatasetMetadataFieldValueProps {
  metadataFieldName: string
  metadataFieldValue: DatasetMetadataFieldValueModel
  metadataBlockDisplayFormatInfo: MetadataBlockInfoDisplayFormat
}

export function DatasetMetadataFieldValue({
  metadataFieldName,
  metadataFieldValue,
  metadataBlockDisplayFormatInfo
}: DatasetMetadataFieldValueProps) {
  const { anonymizedView } = useAnonymized()
  const isAnonymizedField = anonymizedView && metadataFieldValue == ANONYMIZED_FIELD_VALUE
  if (isAnonymizedField) {
    return <AnonymizedFieldValue />
  }

  return (
    <DatasetMetadataFieldValueFormatted
      metadataFieldName={metadataFieldName}
      metadataFieldValue={metadataFieldValue}
      metadataBlockDisplayFormatInfo={metadataBlockDisplayFormatInfo}
    />
  )
}

const AnonymizedFieldValue = () => {
  const { t } = useTranslation('dataset')
  return <p>{t('anonymizedFieldValue')}</p>
}
