import { useEffect, useState } from 'react'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { getMetadataBlockInfoByCollectionId } from '../../metadata-block-info/domain/useCases/getMetadataBlockInfoByCollectionId'
import {
  MetadataBlockInfo,
  MetadataBlockName
} from '../../metadata-block-info/domain/models/MetadataBlockInfo'

interface Props {
  collectionId: string
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

interface UseGetMetadataBlocksNamesInfoReturn {
  metadataBlocksNamesInfo: MetadataBlockName[]
  error: string | null
  isLoading: boolean
}

export const useGetCollectionMetadataBlocksNamesInfo = ({
  collectionId,
  metadataBlockInfoRepository
}: Props): UseGetMetadataBlocksNamesInfoReturn => {
  const [metadataBlocksNamesInfo, setMetadataBlocksNamesInfo] = useState<MetadataBlockName[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetCollectionMetadataBlockNames = async () => {
      setIsLoading(true)
      try {
        const metadataBlocks: MetadataBlockInfo[] = await getMetadataBlockInfoByCollectionId(
          metadataBlockInfoRepository,
          collectionId
        )

        const blocksNames = metadataBlocks.map((block) => block.name) as MetadataBlockName[]

        setMetadataBlocksNamesInfo(blocksNames)
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

    void handleGetCollectionMetadataBlockNames()
  }, [collectionId, metadataBlockInfoRepository])

  return {
    metadataBlocksNamesInfo,
    error,
    isLoading
  }
}
