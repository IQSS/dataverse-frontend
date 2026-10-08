import { DatasetMetadataField } from './DatasetMetadataField'
import { DatasetMetadataFields as DatasetMetadataFieldsModel } from '../../../../dataset/domain/models/Dataset'
import { MetadataBlockInfoDisplayFormat } from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { DatasetTemplateInstruction } from '@/templates/domain/models/Template'

interface DatasetMetadataFieldsProps {
  metadataBlockName: string
  metadataFields: DatasetMetadataFieldsModel
  metadataBlockDisplayFormatInfo: MetadataBlockInfoDisplayFormat
  datasetTemplateInstructions?: DatasetTemplateInstruction[]
}

export function DatasetMetadataFields({
  metadataBlockName,
  metadataFields,
  metadataBlockDisplayFormatInfo,
  datasetTemplateInstructions
}: DatasetMetadataFieldsProps) {
  return (
    <>
      {Object.entries(metadataFields).map(([metadataFieldName, metadataFieldValue], index) => (
        <DatasetMetadataField
          key={`${metadataBlockName}-${metadataFieldName}-${index}`}
          metadataFieldName={metadataFieldName}
          metadataFieldValue={metadataFieldValue}
          metadataBlockDisplayFormatInfo={metadataBlockDisplayFormatInfo}
          datasetTemplateInstructions={datasetTemplateInstructions}
        />
      ))}
    </>
  )
}
