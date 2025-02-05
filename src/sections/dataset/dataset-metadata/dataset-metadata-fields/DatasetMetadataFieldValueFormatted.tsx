import TurndownService from 'turndown'
import {
  METADATA_FIELD_DISPLAY_FORMAT_NAME_PLACEHOLDER,
  METADATA_FIELD_DISPLAY_FORMAT_PLACEHOLDER,
  MetadataBlockInfoDisplayFormat
} from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MarkdownComponent } from '../../markdown/MarkdownComponent'
import {
  DatasetMetadataFieldValue as DatasetMetadataFieldValueModel,
  DatasetMetadataSubField,
  MetadataBlockName
} from '../../../../dataset/domain/models/Dataset'
import { useTranslation } from 'react-i18next'

interface DatasetMetadataFieldValueFormattedProps {
  metadataBlockName: MetadataBlockName
  metadataFieldName: string
  metadataFieldValue: DatasetMetadataFieldValueModel
  metadataBlockDisplayFormatInfo: MetadataBlockInfoDisplayFormat
}

const turndownService = new TurndownService()

function transformHtmlToMarkdown(source: string): string {
  return turndownService.turndown(source)
}

export function DatasetMetadataFieldValueFormatted({
  metadataBlockName,
  metadataFieldName,
  metadataFieldValue,
  metadataBlockDisplayFormatInfo
}: DatasetMetadataFieldValueFormattedProps) {
  const { t } = useTranslation(metadataBlockName)

  const valueFormatted = metadataFieldValueToDisplayFormat(
    metadataFieldName,
    metadataFieldValue,
    metadataBlockDisplayFormatInfo
  )

  const valueFormattedWithNamesTranslated = valueFormatted.replaceAll(
    METADATA_FIELD_DISPLAY_FORMAT_NAME_PLACEHOLDER,
    t(`${metadataBlockName}.datasetField.${metadataFieldName}.name`)
  )

  if (metadataBlockDisplayFormatInfo.fields[metadataFieldName]?.type === 'TEXTBOX') {
    const markdownValue = transformHtmlToMarkdown(valueFormattedWithNamesTranslated)
    return <MarkdownComponent markdown={markdownValue} />
  }

  return <span>{valueFormattedWithNamesTranslated}</span>
}

export function metadataFieldValueToDisplayFormat(
  metadataFieldName: string,
  metadataFieldValue: DatasetMetadataFieldValueModel,
  metadataBlockInfo?: MetadataBlockInfoDisplayFormat
): string {
  const separator = metadataBlockInfo?.fields[metadataFieldName]?.displayFormat ?? ''

  if (isArrayOfObjects(metadataFieldValue)) {
    return metadataFieldValue
      .map((subField) => joinSubFields(subField, metadataBlockInfo))
      .join('\n\n')
  }

  if (Array.isArray(metadataFieldValue)) {
    return metadataFieldValue.join(separator)
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
  metadataBlockInfo?: MetadataBlockInfoDisplayFormat
): string {
  return Object.entries(metadataSubField)
    .map(([subFieldName, subFieldValue]) => {
      return formatSubFieldValue(
        subFieldValue,
        metadataBlockInfo?.fields[subFieldName]?.displayFormat
      )
    })
    .join(' ')
}

function formatSubFieldValue(
  subFieldValue: string | undefined,
  displayFormat: string | undefined
): string {
  if (subFieldValue === undefined) {
    return ''
  }

  if (!displayFormat) {
    return subFieldValue
  }

  return displayFormat.replaceAll(METADATA_FIELD_DISPLAY_FORMAT_PLACEHOLDER, subFieldValue)
}
