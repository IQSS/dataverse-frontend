import { DatasetMetadataBlock } from '../../../dataset/domain/models/Dataset'
import { MetadataBlockInfoRepository } from '../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { SummaryBlock } from './SummaryBlock'

interface SummaryFieldsProps {
  summaryFields: DatasetMetadataBlock[]
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

export function SummaryFields({ summaryFields, metadataBlockInfoRepository }: SummaryFieldsProps) {
  return (
    <>
      {summaryFields.map((metadataBlock, index) => (
        <SummaryBlock
          metadataBlockName={metadataBlock.name}
          metadataFields={metadataBlock.fields}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
          key={`${metadataBlock.name}-${index}`}
        />
      ))}
    </>
  )
}
