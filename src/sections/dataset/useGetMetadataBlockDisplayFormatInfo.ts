import { useEffect, useState } from 'react'
import { MetadataBlockName } from '../../dataset/domain/models/Dataset'
import { MetadataBlockInfoDisplayFormat } from '../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { getMetadataBlockInfoByName } from '../../metadata-block-info/domain/useCases/getMetadataBlockInfoByName'

interface Props {
  metadataBlockName: MetadataBlockName
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

interface UseGetMetadataBlocksDisplayFormatInfoReturn {
  metadataBlockDisplayFormatInfo: MetadataBlockInfoDisplayFormat | undefined
  error: string | null
  isLoading: boolean
}

export const useGetMetadataBlockDisplayFormatInfo = ({
  metadataBlockName,
  metadataBlockInfoRepository
}: Props): UseGetMetadataBlocksDisplayFormatInfoReturn => {
  const [metadataBlockDisplayFormatInfo, setMetadataBlockDisplayFormatInfo] =
    useState<MetadataBlockInfoDisplayFormat>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetMetadatBlockInfoByName = async () => {
      setIsLoading(true)
      try {
        const response = await getMetadataBlockInfoByName(
          metadataBlockInfoRepository,
          metadataBlockName
        )

        setMetadataBlockDisplayFormatInfo(response)
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'There was an error getting the metadata block info by name'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    void handleGetMetadatBlockInfoByName()
  }, [metadataBlockInfoRepository, metadataBlockName])

  return {
    metadataBlockDisplayFormatInfo,
    error,
    isLoading
  }
}
