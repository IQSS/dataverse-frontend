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

  return <MarkdownComponent markdown={valueFormattedWithNamesTranslated} />
}

export function metadataFieldValueToDisplayFormat(
  metadataFieldName: string,
  metadataFieldValue: DatasetMetadataFieldValueModel,
  metadataBlockInfo?: MetadataBlockInfoDisplayFormat
): string {
  const separator = metadataBlockInfo?.fields[metadataFieldName]?.displayFormat ?? ''
  const isTextbox = metadataBlockInfo?.fields[metadataFieldName]?.type === 'TEXTBOX'
  const formatValue = (value: string) => (isTextbox ? transformHtmlToMarkdown(value) : value)

  if (isArrayOfObjects(metadataFieldValue)) {
    return metadataFieldValue
      .map((metadataSubField) => joinSubFields(metadataSubField, metadataBlockInfo))
      .join(' \n \n')
  }

  if (Array.isArray(metadataFieldValue)) {
    return formatValue(metadataFieldValue.join(`${separator} `))
  }

  if (isAnObject(metadataFieldValue)) {
    return formatValue(joinObjectValues(metadataFieldValue, separator))
  }

  return formatValue(metadataFieldValue)
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
        metadataBlockInfo?.fields[subFieldName]?.displayFormat,
        metadataBlockInfo?.fields[subFieldName]?.type
      )
    })
    .join(' ')
}

const turndownService = new TurndownService()
function transformHtmlToMarkdown(source: string): string {
  return turndownService.turndown(source)
}

function formatSubFieldValue(
  subFieldValue: string | undefined,
  displayFormat: string | undefined,
  type: string | undefined
): string {
  if (subFieldValue === undefined) {
    return ''
  }

  const formattedValue =
    type === 'TEXTBOX' && subFieldValue ? transformHtmlToMarkdown(subFieldValue) : subFieldValue

  return displayFormat
    ? displayFormat.replaceAll(METADATA_FIELD_DISPLAY_FORMAT_PLACEHOLDER, formattedValue)
    : formattedValue
}
