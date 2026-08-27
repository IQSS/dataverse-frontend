import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import TurndownService from 'turndown'

import {
  getPublicationRelationLabel,
  METADATA_FIELD_DISPLAY_FORMAT_NAME_PLACEHOLDER,
  METADATA_FIELD_DISPLAY_FORMAT_PLACEHOLDER,
  MetadataBlockInfoDisplayFormat,
  PUBLICATION_RELATION_TYPE_FIELD_NAME
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
  const { t } = useTranslation('shared')
  const valueFormatted = metadataFieldValueToDisplayFormat(
    metadataFieldValue,
    metadataBlockDisplayFormatInfo,
    metadataFieldName,
    t
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
  metadataFieldName?: string,
  t?: TFunction
): string {
  const separator = ';'

  if (isArrayOfObjects(metadataFieldValue)) {
    return metadataFieldValue
      .map((metadataSubField) =>
        joinSubFields(metadataSubField, metadataBlockInfo, metadataFieldName, t)
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
  parentFieldName?: string,
  t?: TFunction
): string {
  let parentDisplayFormat = ''
  if (parentFieldName) {
    parentDisplayFormat = metadataBlockInfo?.fields[parentFieldName]?.displayFormat ?? ''
  }

  const subfields = Object.entries(metadataSubField).map(([subFieldName, subFieldValue]) => {
    let formattedSubFieldValue = formatSubFieldValue(
      subFieldName,
      subFieldValue,
      metadataBlockInfo.fields[subFieldName]?.displayFormat,
      metadataBlockInfo.fields[subFieldName]?.title,
      t
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
  subFieldName: string,
  subFieldValue: string | undefined,
  displayFormat: string | undefined,
  fieldTitle: string | undefined,
  t?: TFunction
): string {
  if (subFieldValue === undefined) {
    return ''
  }

  const displayValue =
    subFieldName === PUBLICATION_RELATION_TYPE_FIELD_NAME && t
      ? getPublicationRelationLabel(subFieldValue, t)
      : subFieldValue

  if (!displayFormat) {
    return displayValue
  }

  const valueFormatted = displayFormat.replaceAll(
    METADATA_FIELD_DISPLAY_FORMAT_PLACEHOLDER,
    displayValue
  )
  const valueFormattedWithNamesTranslated = valueFormatted.replaceAll(
    METADATA_FIELD_DISPLAY_FORMAT_NAME_PLACEHOLDER,
    fieldTitle ?? ''
  )
  return valueFormattedWithNamesTranslated
}
