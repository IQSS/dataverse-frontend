import TurndownService from 'turndown'
import {
  METADATA_FIELD_DISPLAY_FORMAT_NAME_PLACEHOLDER,
  METADATA_FIELD_DISPLAY_FORMAT_PLACEHOLDER,
  MetadataBlockInfoDisplayFormat
} from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MarkdownComponent } from '../../markdown/MarkdownComponent'
import {
  DatasetMetadataFieldValue as DatasetMetadataFieldValueModel,
  DatasetMetadataSubField
} from '../../../../dataset/domain/models/Dataset'
import { ExpandableContent } from '@/sections/shared/expandable-content/ExpandableContent'

interface DatasetMetadataFieldValueFormattedProps {
  metadataFieldName: string
  metadataFieldValue: DatasetMetadataFieldValueModel
  metadataBlockDisplayFormatInfo: MetadataBlockInfoDisplayFormat
}

const turndownService = new TurndownService()

function transformHtmlToMarkdown(source: string): string {
  return turndownService.turndown(source)
}

export function DatasetMetadataFieldValueFormatted({
  metadataFieldName,
  metadataFieldValue,
  metadataBlockDisplayFormatInfo
}: DatasetMetadataFieldValueFormattedProps) {
  const valueFormatted = metadataFieldValueToDisplayFormat(
    metadataFieldValue,
    metadataBlockDisplayFormatInfo,
    metadataFieldName
  )

  const valueFormattedWithNamesTranslated = valueFormatted.replaceAll(
    METADATA_FIELD_DISPLAY_FORMAT_NAME_PLACEHOLDER,
    metadataBlockDisplayFormatInfo.fields[metadataFieldName]?.title ?? ''
  )

  if (metadataBlockDisplayFormatInfo.fields[metadataFieldName]?.type === 'URL') {
    return (
      <a href={`${String(metadataFieldValue)}`} target="_blank" rel="noreferrer">
        {String(metadataFieldValue)}
      </a>
    )
  }

  if (metadataFieldName === 'dsDescription') {
    return (
      <ExpandableContent
        contentName={metadataBlockDisplayFormatInfo.fields[metadataFieldName]?.title}>
        <MarkdownComponent markdown={valueFormattedWithNamesTranslated} />
      </ExpandableContent>
    )
  }

  if (metadataBlockDisplayFormatInfo.fields[metadataFieldName]?.type === 'TEXTBOX') {
    const markdownValue = transformHtmlToMarkdown(valueFormattedWithNamesTranslated)

    return <MarkdownComponent markdown={markdownValue} />
  }

  return <MarkdownComponent markdown={valueFormattedWithNamesTranslated} />
}

export function metadataFieldValueToDisplayFormat(
  metadataFieldValue: DatasetMetadataFieldValueModel,
  metadataBlockInfo: MetadataBlockInfoDisplayFormat,
  metadataFieldName?: string
): string {
  const separator = ';'

  if (isArrayOfObjects(metadataFieldValue)) {
    return metadataFieldValue
      .map((metadataSubField) =>
        joinSubFields(metadataSubField, metadataBlockInfo, metadataFieldName)
      )
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

export function joinSubFields(
  metadataSubField: DatasetMetadataSubField,
  metadataBlockInfo: MetadataBlockInfoDisplayFormat,
  parentFieldName?: string
): string {
  let parentDisplayFormat = ''
  if (parentFieldName) {
    parentDisplayFormat = metadataBlockInfo?.fields[parentFieldName]?.displayFormat ?? ''
  }

  const subfields = Object.entries(metadataSubField).map(([subFieldName, subFieldValue]) => {
    let formattedSubFieldValue = formatSubFieldValue(
      subFieldValue,
      metadataBlockInfo.fields[subFieldName]?.displayFormat,
      metadataBlockInfo.fields[subFieldName]?.title
    )

    const subFieldType = metadataBlockInfo?.fields[subFieldName]?.type as string

    if (subFieldType === 'TEXTBOX') {
      formattedSubFieldValue = transformHtmlToMarkdown(formattedSubFieldValue)
    }

    if (subFieldName === 'datasetContactEmail') {
      return {
        fullFieldName: subFieldName,
        value: ''
      }
    }

    return {
      fullFieldName: subFieldName,
      value: formattedSubFieldValue
    }
  })
  return subfields.map((field) => `${field.value}`).join(parentDisplayFormat + ' ')
}

function formatSubFieldValue(
  subFieldValue: string | undefined,
  displayFormat: string | undefined,
  fieldTitle: string | undefined
): string {
  if (subFieldValue === undefined) {
    return ''
  }

  if (!displayFormat) {
    return subFieldValue
  }

  const valueFormatted = displayFormat.replaceAll(
    METADATA_FIELD_DISPLAY_FORMAT_PLACEHOLDER,
    subFieldValue
  )
  const valueFormattedWithNamesTranslated = valueFormatted.replaceAll(
    METADATA_FIELD_DISPLAY_FORMAT_NAME_PLACEHOLDER,
    fieldTitle ?? ''
  )
  return valueFormattedWithNamesTranslated
}
