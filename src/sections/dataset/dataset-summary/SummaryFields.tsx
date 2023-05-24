import { DatasetMetadataFields } from '../dataset-metadata/dataset-metadata-fields/DatasetMetadataFields'
import { DatasetMetadataBlock } from '../../../dataset/domain/models/Dataset'

interface SummaryFieldsProps {
  summaryFields: DatasetMetadataBlock[]
}

export function SummaryFields({ summaryFields }: SummaryFieldsProps) {
  return (
    <>
      {summaryFields.map((metadataBlock, index) => (
        <DatasetMetadataFields
          key={`${metadataBlock.name}-${index}`}
          metadataBlockName={metadataBlock.name}
          metadataFields={metadataBlock.fields}
        />
      ))}
    </>
  )
}
