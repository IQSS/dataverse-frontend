import { useGetMetadataBlocksInfo } from './useGetMetadataBlocksInfo'
import { DatasetRepository } from '../../../../dataset/domain/repositories/DatasetRepository'
import { MetadataBlockInfoRepository } from '../../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { Form } from './Form'

type DatasetMetadataFormProps = {
  mode: DatasetMetadataFormMode
  collectionId: string
  datasetRepository: DatasetRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

export type DatasetMetadataFormMode = 'create' | 'edit'

export const DatasetMetadataForm = ({
  mode,
  collectionId,
  datasetRepository,
  metadataBlockInfoRepository
}: DatasetMetadataFormProps) => {
  const {
    metadataBlocksInfo,
    isLoading: isLoadingMetadataBlocksInfo,
    error: errorLoadingMetadataBlocksInfo
  } = useGetMetadataBlocksInfo({
    mode,
    collectionId,
    metadataBlockInfoRepository
  })

  console.log({ metadataBlocksInfo, isLoadingMetadataBlocksInfo, errorLoadingMetadataBlocksInfo })

  // formDefaultValues here
  return (
    <>
      {/* is loading && skeleton else show form */}

      <Form />
    </>
  )
}
