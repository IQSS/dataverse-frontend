import { DatasetMetadataField } from './DatasetMetadataField'
import { DatasetMetadataFields as DatasetMetadataFieldsModel } from '../../../../dataset/domain/models/Dataset'
import { MetadataBlockName } from '../../../../dataset/domain/models/Dataset'

interface DatasetMetadataFieldsProps {
  metadataBlockName: MetadataBlockName
  metadataFields: DatasetMetadataFieldsModel
}

export function DatasetMetadataFields({
  metadataBlockName,
  metadataFields
}: DatasetMetadataFieldsProps) {
  return (
    <>
      {Object.entries(metadataFields).map(([metadataFieldName, metadataFieldValue], index) => (
        <DatasetMetadataField
          key={`${metadataBlockName}-${metadataFieldName}-${index}`}
          metadataBlockName={metadataBlockName}
          metadataFieldName={metadataFieldName}
          metadataFieldValue={metadataFieldValue}
        />
      ))}
    </>
  )
}
