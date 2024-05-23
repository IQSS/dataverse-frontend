import { useEffect, useState } from 'react'
import { getDisplayedOnCreateMetadataBlockInfoByCollectionId } from '../../metadata-block-info/domain/useCases/getDisplayedOnCreateMetadataBlockInfoByCollectionId'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfo } from '../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataFieldsHelper } from './MetadataFieldsHelper'

interface Props {
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  collectionId: string
}

interface UseGetMetadataBlocksInfoReturn {
  metadataBlocks: MetadataBlockInfo[]
  error: string | null
  isLoading: boolean
}

export const useGetMetadataBlocksInfo = ({
  metadataBlockInfoRepository,
  collectionId
}: Props): UseGetMetadataBlocksInfoReturn => {
  const [metadataBlocks, setMetadataBlocks] = useState<MetadataBlockInfo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetDatasetMetadataBlockFields = async () => {
      setIsLoading(true)
      try {
        const metadataBlocksInfo: MetadataBlockInfo[] =
          await getDisplayedOnCreateMetadataBlockInfoByCollectionId(
            metadataBlockInfoRepository,
            collectionId
          )

        const mappedMetadataBlocks =
          MetadataFieldsHelper.replaceDotNamesKeysWithSlash(metadataBlocksInfo)

        setMetadataBlocks(mappedMetadataBlocks)
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
    metadataBlocks,
    error,
    isLoading
  }
}
