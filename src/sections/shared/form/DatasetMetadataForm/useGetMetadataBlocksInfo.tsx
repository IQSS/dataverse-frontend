import { useEffect, useState } from 'react'
import { getDisplayedOnCreateMetadataBlockInfoByCollectionId } from '../../../../metadata-block-info/domain/useCases/getDisplayedOnCreateMetadataBlockInfoByCollectionId'
import { MetadataBlockInfoRepository } from '../../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfo } from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataFieldsHelper } from '../../../create-dataset/MetadataFieldsHelper'
import { DatasetMetadataFormMode } from '.'

interface Props {
  mode: DatasetMetadataFormMode
  collectionId: string
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

interface UseGetMetadataBlocksInfoReturn {
  metadataBlocksInfo: MetadataBlockInfo[]
  error: string | null
  isLoading: boolean
}

export const useGetMetadataBlocksInfo = ({
  mode,
  collectionId,
  metadataBlockInfoRepository
}: Props): UseGetMetadataBlocksInfoReturn => {
  const [metadataBlocksInfo, setMetadataBlocksInfo] = useState<MetadataBlockInfo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  console.log({ mode, collectionId })

  useEffect(() => {
    const handleGetDatasetMetadataBlockFields = async () => {
      setIsLoading(true)
      try {
        const metadataBlocks: MetadataBlockInfo[] =
          await getDisplayedOnCreateMetadataBlockInfoByCollectionId(
            metadataBlockInfoRepository,
            collectionId
          )
        const mappedMetadataBlocks =
          MetadataFieldsHelper.replaceDotNamesKeysWithSlash(metadataBlocks)
        setMetadataBlocksInfo(mappedMetadataBlocks)
      } catch (err) {
        console.error(err)
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : /* istanbul ignore next */ 'Something went wrong getting the information from the metadata blocks. Try again later.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }
    void handleGetDatasetMetadataBlockFields()
  }, [collectionId, metadataBlockInfoRepository])

  return {
    metadataBlocksInfo,
    error,
    isLoading
  }
}
