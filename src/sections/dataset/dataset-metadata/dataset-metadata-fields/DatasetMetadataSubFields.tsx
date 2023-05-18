import { DatasetMetadataSubField } from '../../../../dataset/domain/models/Dataset'
import { MarkdownComponent } from '../../markdown/MarkdownComponent'

interface DatasetMetadataSubFieldsProps {
  fieldName: string
  metadataSubFields: DatasetMetadataSubField[]
}
export function DatasetMetadataSubFields({
  fieldName,
  metadataSubFields
}: DatasetMetadataSubFieldsProps) {
  return (
    <>
      {metadataSubFields.map((metadataSubField, index) => (
        <div key={`${fieldName}-${index}`}>
          <MarkdownComponent
            markdown={Object.values(metadataSubField)
              .map((value) => value)
              .join(' ')}
          />
        </div>
      ))}
    </>
  )
}
