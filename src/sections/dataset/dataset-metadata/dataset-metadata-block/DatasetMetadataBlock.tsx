import { DatasetMetadataBlock as DatasetMetadataBlockModel } from '../../../../dataset/domain/models/Dataset'
import { Accordion } from '@iqss/dataverse-design-system'
import { DatasetMetadataFields } from '../dataset-metadata-fields/DatasetMetadataFields'
import { MetadataBlockInfoRepository } from '../../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useGetMetadataBlockDisplayFormatInfo } from '../../useGetMetadataBlockDisplayFormatInfo'
import { DatasetMetadataBlockSkeleton } from './DatasetMetadataBlockSkeleton'

interface DatasetMetadataBlockProps {
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  metadataBlock: DatasetMetadataBlockModel
}

export function DatasetMetadataBlock({
  metadataBlock,
  metadataBlockInfoRepository
}: DatasetMetadataBlockProps) {
  const {
    metadataBlockDisplayFormatInfo,
    isLoading: isLoadingMetadataBlockDisplayFormatInfo,
    error: errorLoadingMetadataBlockDisplayFormatInfo
  } = useGetMetadataBlockDisplayFormatInfo({
    metadataBlockName: metadataBlock.name,
    metadataBlockInfoRepository
  })

  if (errorLoadingMetadataBlockDisplayFormatInfo) {
    return <span data-testid="ds-metadata-block-display-format-error"></span>
  }

  if (isLoadingMetadataBlockDisplayFormatInfo || !metadataBlockDisplayFormatInfo) {
    return <DatasetMetadataBlockSkeleton />
  }

  return (
    <>
      <Accordion.Header>{metadataBlockDisplayFormatInfo.displayName}</Accordion.Header>
      <Accordion.Body>
        <DatasetMetadataFields
          metadataBlockName={metadataBlock.name}
          metadataFields={metadataBlock.fields}
          metadataBlockDisplayFormatInfo={metadataBlockDisplayFormatInfo}
        />
      </Accordion.Body>
    </>
  )
}
