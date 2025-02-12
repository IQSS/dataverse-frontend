import { SummaryFields } from './SummaryFields'
import { DatasetLicense, DatasetMetadataBlock } from '../../../dataset/domain/models/Dataset'
import { SummaryLicense } from './SummaryLicense'
import { MetadataBlockInfoRepository } from '../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'

interface DatasetSummaryProps {
  summaryFields: DatasetMetadataBlock[]
  license?: DatasetLicense
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  onCustomTermsClick: () => void
}

export function DatasetSummary({
  summaryFields,
  license,
  metadataBlockInfoRepository,
  onCustomTermsClick
}: DatasetSummaryProps) {
  return (
    <>
      <SummaryFields
        summaryFields={summaryFields}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
      <SummaryLicense license={license} onCustomTermsClick={onCustomTermsClick} />
    </>
  )
}
