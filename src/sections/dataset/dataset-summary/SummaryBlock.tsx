import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import {
  DatasetMetadataFields as DatasetMetadataFieldsModel,
  MetadataBlockName
} from '../../../dataset/domain/models/Dataset'
import { MetadataBlockInfoRepository } from '../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { DatasetMetadataFields } from '../dataset-metadata/dataset-metadata-fields/DatasetMetadataFields'

import { useGetMetadataBlockDisplayFormatInfo } from '../useGetMetadataBlockDisplayFormatInfo'
import { Col, Row } from '@iqss/dataverse-design-system'
import { useId } from 'react'

interface SummaryBlockProps {
  metadataBlockName: MetadataBlockName
  metadataFields: DatasetMetadataFieldsModel
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}
export const SummaryBlock = ({
  metadataBlockName,
  metadataFields,
  metadataBlockInfoRepository
}: SummaryBlockProps) => {
  const {
    metadataBlockDisplayFormatInfo,
    isLoading: isLoadingMetadataBlockDisplayFormatInfo,
    error: errorLoadingMetadataBlockDisplayFormatInfo
  } = useGetMetadataBlockDisplayFormatInfo({
    metadataBlockName,
    metadataBlockInfoRepository
  })

  if (errorLoadingMetadataBlockDisplayFormatInfo) {
    return <span data-testid="summary-block-display-format-error"></span>
  }

  if (isLoadingMetadataBlockDisplayFormatInfo || !metadataBlockDisplayFormatInfo) {
    return <SummaryBlockSkeleton rowsCount={Object.keys(metadataFields).length} />
  }

  return (
    <DatasetMetadataFields
      metadataBlockName={metadataBlockName}
      metadataFields={metadataFields}
      metadataBlockDisplayFormatInfo={metadataBlockDisplayFormatInfo}
    />
  )
}

const SummaryBlockSkeleton = ({ rowsCount }: { rowsCount: number }) => {
  const blockId = useId()

  return (
    <SkeletonTheme>
      {Array.from({ length: rowsCount }).map((_, index) => (
        <Row style={{ marginBottom: '1rem' }} key={`${blockId}-${index}`}>
          <Col sm={3}>
            <Skeleton height={20} width={160} />
          </Col>
          <Col sm={9}>
            <Skeleton height={20} width={220} />
          </Col>
        </Row>
      ))}
    </SkeletonTheme>
  )
}
