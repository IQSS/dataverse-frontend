import { SummaryFields } from './SummaryFields'
import { DatasetLicense, DatasetMetadataBlock } from '../../../dataset/domain/models/Dataset'
import { License } from './License'

interface DatasetSummaryProps {
  summaryFields: DatasetMetadataBlock[]
  license: DatasetLicense
}

export function DatasetSummary({ summaryFields, license }: DatasetSummaryProps) {
  return (
    <>
      <SummaryFields summaryFields={summaryFields}></SummaryFields>
      <License license={license}></License>
    </>
  )
}
