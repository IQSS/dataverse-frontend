import { DatasetMetadataSubField } from '../../../../dataset/domain/models/Dataset'

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
          {Object.values(metadataSubField).map((value, index) => (
            <span key={`${fieldName}-${value}-${index}`}>{value} </span>
          ))}
          <br />
        </div>
      ))}
    </>
  )
}
