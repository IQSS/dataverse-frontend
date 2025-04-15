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

const timePeriodObj = new Set(['timePeriodCovered', 'dateOfCollection'])

export function DatasetMetadataFieldValueFormatted({
  metadataBlockName,
  metadataFieldName,
  metadataFieldValue,
  metadataBlockDisplayFormatInfo
}: DatasetMetadataFieldValueFormattedProps) {
  const { t } = useTranslation(metadataBlockName)

  const valueFormatted = metadataFieldValueToDisplayFormat(
    metadataFieldValue,
    metadataBlockDisplayFormatInfo,
    metadataFieldName
  )

  let valueFormattedWithNamesTranslated

  if (metadataFieldName == 'software') {
    valueFormattedWithNamesTranslated = valueFormatted.replaceAll(
      METADATA_FIELD_DISPLAY_FORMAT_NAME_PLACEHOLDER,
      'Version'
    )
  }

  if (timePeriodObj.has(metadataFieldName)) {
    valueFormattedWithNamesTranslated = valueFormatted
      .replace(METADATA_FIELD_DISPLAY_FORMAT_NAME_PLACEHOLDER, 'Start Date')
      .replace(METADATA_FIELD_DISPLAY_FORMAT_NAME_PLACEHOLDER, 'End Date')
  }

  valueFormattedWithNamesTranslated = valueFormatted.replaceAll(
    METADATA_FIELD_DISPLAY_FORMAT_NAME_PLACEHOLDER,
    t(`${metadataBlockName}.datasetField.${metadataFieldName}.name`)
  )

  if (metadataFieldName === 'alternativeURL') {
    return (
      <a href={`${String(metadataFieldValue)}`} target="_blank" rel="noreferrer">
        {String(metadataFieldValue)}
      </a>
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
  metadataBlockInfo?: MetadataBlockInfoDisplayFormat,
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

function joinSubFields(
  metadataSubField: DatasetMetadataSubField,
  metadataBlockInfo?: MetadataBlockInfoDisplayFormat,
  parentFieldName?: string
): string {
  const commaJoinObj = new Set(['software'])
  const colunJoinObj = new Set(['series', 'grantNumber', 'contributor', 'otherId', 'fundingAgency'])

  const useColonJoin = parentFieldName && colunJoinObj.has(parentFieldName)
  const useSeperatorJoin = parentFieldName && timePeriodObj.has(parentFieldName)
  const useCommaJoin = parentFieldName && commaJoinObj.has(parentFieldName)

  const subfields = Object.entries(metadataSubField).map(([subFieldName, subFieldValue]) => {
    let formattedSubFieldValue = formatSubFieldValue(
      subFieldValue,
      metadataBlockInfo?.fields[subFieldName]?.displayFormat
    )

    const subFieldType = metadataBlockInfo?.fields[subFieldName]?.type as string

    if (subFieldType === 'TEXTBOX') {
      formattedSubFieldValue = transformHtmlToMarkdown(formattedSubFieldValue)
    }

    return {
      fullFieldName: subFieldName,
      value: formattedSubFieldValue
    }
  })

  if (useSeperatorJoin) {
    return subfields.map((field) => `${field.value}`).join('; ')
  }

  if (useColonJoin && subfields.length === 2) {
    return `${subfields[0].value}: ${subfields[1].value}`
  }

  if (useCommaJoin && subfields.length === 2) {
    return `${subfields[0].value}, ${subfields[1].value}`
  }

  return subfields.map((field) => `${field.value}`).join(' \n ')
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
