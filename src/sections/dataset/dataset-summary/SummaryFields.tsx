import { DatasetMetadataFields } from '../dataset-metadata/dataset-metadata-fields/DatasetMetadataFields'
import { DatasetMetadataBlock, MetadataBlockName } from '../../../dataset/domain/models/Dataset'
import { useGetMetadataBlockDisplayFormatInfo } from '../useGetMetadataBlockDisplayFormatInfo'
import { MetadataBlockInfoRepository } from '../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'

interface SummaryFieldsProps {
  summaryFields: DatasetMetadataBlock[]
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

export function SummaryFields({ summaryFields, metadataBlockInfoRepository }: SummaryFieldsProps) {
  const {
    metadataBlockDisplayFormatInfo,
    isLoading: isLoadingMetadataBlockDisplayFormatInfo,
    error: errorLoadingMetadataBlockDisplayFormatInfo
  } = useGetMetadataBlockDisplayFormatInfo({
    metadataBlockName: MetadataBlockName.CITATION,
    metadataBlockInfoRepository
  })

  if (
    isLoadingMetadataBlockDisplayFormatInfo ||
    errorLoadingMetadataBlockDisplayFormatInfo ||
    !metadataBlockDisplayFormatInfo
  ) {
    return null
  }

  return (
    <>
      {summaryFields.map((metadataBlock, index) => (
        <DatasetMetadataFields
          key={`${metadataBlock.name}-${index}`}
          metadataBlockName={metadataBlock.name}
          metadataFields={metadataBlock.fields}
          metadataBlockDisplayFormatInfo={metadataBlockDisplayFormatInfo}
        />
      ))}
    </>
  )
}
