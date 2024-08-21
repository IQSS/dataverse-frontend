import { useEffect, useState } from 'react'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { getMetadataBlockInfoByCollectionId } from '../../metadata-block-info/domain/useCases/getMetadataBlockInfoByCollectionId'
import { MetadataBlockInfo } from '../../metadata-block-info/domain/models/MetadataBlockInfo'

interface Props {
  collectionId: string
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

interface UseGetMetadataBlocksInfoReturn {
  metadataBlocksInfo: MetadataBlockInfo[]
  error: string | null
  isLoading: boolean
}

export const useGetCollectionMetadataBlocksInfo = ({
  collectionId,
  metadataBlockInfoRepository
}: Props): UseGetMetadataBlocksInfoReturn => {
  const [metadataBlocksInfo, setMetadataBlocksInfo] = useState<MetadataBlockInfo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetCollectionMetadataBlocks = async () => {
      setIsLoading(true)
      try {
        const metadataBlocks: MetadataBlockInfo[] = await getMetadataBlockInfoByCollectionId(
          metadataBlockInfoRepository,
          collectionId
        )

        setMetadataBlocksInfo(metadataBlocks)
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the information from the metadata blocks. Try again later.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    void handleGetCollectionMetadataBlocks()
  }, [collectionId, metadataBlockInfoRepository])

  return {
    metadataBlocksInfo,
    error,
    isLoading
  }
}
