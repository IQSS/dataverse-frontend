import { DatasetMetadataField } from './DatasetMetadataField'
import { DatasetMetadataField as DatasetMetadataFieldModel } from '../../../../dataset/domain/models/Dataset'

interface DatasetMetadataFieldsProps {
  metadataFields: DatasetMetadataFieldModel[]
}

export function DatasetMetadataFields({ metadataFields }: DatasetMetadataFieldsProps) {
  return (
    <>
      {metadataFields.map((metadataField, index) => (
        <DatasetMetadataField
          key={`${metadataField.title}-${index}`}
          metadataField={metadataField}
        />
      ))}
    </>
  )
}
