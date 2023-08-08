import { useMetadataBlockInfo } from '../../metadata-block-info/MetadataBlockInfoContext'
import {
  METADATA_FIELD_DISPLAY_FORMAT_PLACEHOLDER,
  MetadataBlockInfo
} from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MarkdownComponent } from '../../markdown/MarkdownComponent'
import {
  DatasetMetadataFieldValue as DatasetMetadataFieldValueModel,
  DatasetMetadataSubField
} from '../../../../dataset/domain/models/Dataset'

interface DatasetMetadataFieldValueFormattedProps {
  metadataFieldName: string
  metadataFieldValue: DatasetMetadataFieldValueModel
}
export function DatasetMetadataFieldValueFormatted({
  metadataFieldName,
  metadataFieldValue
}: DatasetMetadataFieldValueFormattedProps) {
  const { metadataBlockInfo } = useMetadataBlockInfo()
  const metadataFieldValueMarkdown = metadataFieldValueToMarkdownFormat(
    metadataFieldName,
    metadataFieldValue,
    metadataBlockInfo
  )

  return <MarkdownComponent markdown={metadataFieldValueMarkdown} />
}

export function metadataFieldValueToMarkdownFormat(
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
    return joinObjectValues(metadataFieldValue, separator)
  }

  return metadataFieldValue
}

export function isArrayOfObjects(variable: unknown): variable is object[] {
  return Array.isArray(variable) && variable.every(isAnObject)
}

function isAnObject(variable: unknown): variable is object {
  return typeof variable === 'object' && variable !== null
}

function joinObjectValues(obj: object, separator: string): string {
  return Object.values(obj).join(separator)
}

function joinSubFields(
  metadataSubField: DatasetMetadataSubField,
  metadataBlockInfo?: MetadataBlockInfo
): string {
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
