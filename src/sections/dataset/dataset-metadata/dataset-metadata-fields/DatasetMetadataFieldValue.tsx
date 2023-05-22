import { DatasetMetadataField as DatasetMetadataFieldModel } from '../../../../dataset/domain/models/Dataset'
import { MarkdownComponent } from '../../markdown/MarkdownComponent'
import { DatasetMetadataSubFields } from './DatasetMetadataSubFields'

interface DatasetMetadataFieldValueProps {
  metadataFieldName: string
  metadataField: DatasetMetadataFieldModel
}

export function DatasetMetadataFieldValue({
  metadataFieldName,
  metadataField
}: DatasetMetadataFieldValueProps) {
  return typeof metadataField === 'string' ? (
    <MarkdownComponent markdown={metadataField} />
  ) : (
    <DatasetMetadataSubFields fieldName={metadataFieldName} metadataSubFields={metadataField} />
  )
}
