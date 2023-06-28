import {
  ANONYMIZED_FIELD_VALUE,
  DatasetMetadataFieldValue as DatasetMetadataFieldValueModel,
  DatasetMetadataSubField
} from '../../../../dataset/domain/models/Dataset'
import { MarkdownComponent } from '../../markdown/MarkdownComponent'
import { useAnonymized } from '../../anonymized/AnonymizedContext'
import { useTranslation } from 'react-i18next'
import { useMetadataBlockInfo } from '../../metadata-block-info/MetadataBlockInfoContext'
import {
  METADATA_FIELD_DISPLAY_FORMAT_PLACEHOLDER,
  MetadataBlockInfo
} from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'

interface DatasetMetadataFieldValueProps {
  metadataFieldName: string
  metadataFieldValue: DatasetMetadataFieldValueModel
}

export function DatasetMetadataFieldValue({
  metadataFieldName,
  metadataFieldValue
}: DatasetMetadataFieldValueProps) {
  const { anonymizedView } = useAnonymized()
  const isAnonymizedField = anonymizedView && metadataFieldValue == ANONYMIZED_FIELD_VALUE
  const { metadataBlockInfo } = useMetadataBlockInfo()

  if (isAnonymizedField) {
    return <AnonymizedFieldValue />
  }

  return (
    <MarkdownComponent
      markdown={metadataFieldValueToString(
        metadataFieldName,
        metadataFieldValue,
        metadataBlockInfo
      )}
    />
  )
}

const AnonymizedFieldValue = () => {
  const { t } = useTranslation('dataset')
  return <p>{t('anonymizedFieldValue')}</p>
}

export function metadataFieldValueToString(
  metadataFieldName: string,
  metadataFieldValue: DatasetMetadataFieldValueModel,
  metadataBlockInfo?: MetadataBlockInfo
): string {
  const separator = metadataBlockInfo?.fields[metadataFieldName]?.displayFormat ?? ''

  if (isArrayOfObjects(metadataFieldValue)) {
    return metadataFieldValue
      .map((metadataSubField) => joinSubFields(metadataSubField, metadataBlockInfo))
      .join(' \n \n')
  }

  if (Array.isArray(metadataFieldValue)) {
    return metadataFieldValue.join(`${separator} `)
  }

  if (isAnObject(metadataFieldValue)) {
    return Object.values(metadataFieldValue).join(`${separator} `)
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

function joinSubFields(
  metadataSubField: DatasetMetadataSubField,
  metadataBlockInfo?: MetadataBlockInfo
) {
  return Object.entries(metadataSubField)
    .map(([subFieldName, subFieldValue]) =>
      formatSubFieldValue(subFieldValue, metadataBlockInfo?.fields[subFieldName]?.displayFormat)
    )
    .join(' ')
}

function formatSubFieldValue(
  subFieldValue: string | undefined,
  displayFormat: string | undefined
): string {
  if (subFieldValue === undefined) {
    return ''
  }

  if (displayFormat === undefined) {
    return subFieldValue
  }

  return displayFormat.replaceAll(METADATA_FIELD_DISPLAY_FORMAT_PLACEHOLDER, subFieldValue)
}
