import { SummaryFields } from './SummaryFields'
import {
  License as LicenseModel,
  DatasetMetadataBlock
} from './../../../../src/dataset/domain/models/Dataset'
import { License } from './License'

interface DatasetSummaryProps {
  summaryFields: DatasetMetadataBlock[]
  license: LicenseModel
}

export function DatasetSummary({ summaryFields, license }: DatasetSummaryProps) {
  return (
    <article>
      <SummaryFields summaryFields={summaryFields}></SummaryFields>
      <License license={license}></License>
    </article>
  )
}
