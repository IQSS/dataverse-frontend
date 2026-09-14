import { Row, Col } from '@iqss/dataverse-design-system'
import { SummaryFields } from './SummaryFields'
import { DatasetLicense, DatasetMetadataBlock } from '../../../dataset/domain/models/Dataset'
import { SummaryLicense } from './SummaryLicense'
import { MetadataBlockInfoRepository } from '../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useTranslation } from 'react-i18next'

interface DatasetSummaryProps {
  summaryFields: DatasetMetadataBlock[]
  license?: DatasetLicense
  datasetType?: string
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  onCustomTermsClick: () => void
}

export function DatasetSummary({
  summaryFields,
  license,
  datasetType,
  metadataBlockInfoRepository,
  onCustomTermsClick
}: DatasetSummaryProps) {
  const { t } = useTranslation('dataset')

  return (
    <>
      <SummaryFields
        summaryFields={summaryFields}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
      <SummaryLicense license={license} onCustomTermsClick={onCustomTermsClick} />
      {datasetType && (
        <Row className="mt-2">
          <Col md={3}>
            <b>{t('datasetType.label')}</b>
          </Col>
          <Col md={9} className="pt-1 pt-md-0 text-capitalize">
            {datasetType}
          </Col>
        </Row>
      )}
    </>
  )
}
