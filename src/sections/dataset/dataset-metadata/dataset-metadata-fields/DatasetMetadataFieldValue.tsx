import {
  ANONYMIZED_FIELD_VALUE,
  DatasetMetadataFieldValue as DatasetMetadataFieldValueModel
} from '../../../../dataset/domain/models/Dataset'
import { MarkdownComponent } from '../../markdown/MarkdownComponent'
import { useAnonymized } from '../../anonymized/AnonymizedContext'
import { useTranslation } from 'react-i18next'

interface DatasetMetadataFieldValueProps {
  metadataFieldValue: DatasetMetadataFieldValueModel
}

export function DatasetMetadataFieldValue({ metadataFieldValue }: DatasetMetadataFieldValueProps) {
  const { anonymizedView } = useAnonymized()

  const isAnonymizedField = anonymizedView && metadataFieldValue == ANONYMIZED_FIELD_VALUE
  if (isAnonymizedField) {
    return <AnonymizedFieldValue />
  }

  return <MarkdownComponent markdown={metadataFieldValueToString(metadataFieldValue)} />
}

const AnonymizedFieldValue = () => {
  const { t } = useTranslation('dataset')
  return <p>{t('anonymizedFieldValue')}</p>
}

export function metadataFieldValueToString(
  metadataFieldValue: DatasetMetadataFieldValueModel
): string {
  if (isArrayOfObjects(metadataFieldValue)) {
    return metadataFieldValue.map((field) => Object.values(field).join(' ')).join(' \n \n')
  }

  if (Array.isArray(metadataFieldValue)) {
    return metadataFieldValue.join('; ')
  }

  if (isAnObject(metadataFieldValue)) {
    return Object.values(metadataFieldValue).join(' ')
  }

  return metadataFieldValue
}

export function isArrayOfObjects(variable: unknown): variable is object[] {
  if (!Array.isArray(variable)) {
    return false
  }

  return variable.every((item) => isAnObject(item))
}

function isAnObject(variable: unknown): variable is object {
  return typeof variable === 'object' && variable !== null
}
