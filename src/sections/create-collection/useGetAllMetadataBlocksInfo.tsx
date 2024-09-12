import { useEffect, useState } from 'react'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfo } from '../../metadata-block-info/domain/models/MetadataBlockInfo'
import { getAllMetadataBlocksInfo } from '../../metadata-block-info/domain/useCases/getAllMetadataBlocksInfo'
import { MetadataFieldsHelper } from '../shared/form/DatasetMetadataForm/MetadataFieldsHelper'

interface Props {
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

interface UseGetAllMetadataBlocksInfo {
  allMetadataBlocksInfo: MetadataBlockInfo[]
  error: string | null
  isLoading: boolean
}

export const useGetAllMetadataBlocksInfo = ({
  metadataBlockInfoRepository
}: Props): UseGetAllMetadataBlocksInfo => {
  const [allMetadataBlocksInfo, setAllMetadataBlocksInfo] = useState<MetadataBlockInfo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetInfo = async () => {
      setIsLoading(true)
      try {
        const blocksInfo = await getAllMetadataBlocksInfo(metadataBlockInfoRepository)

        const metadataBlocksInfoNormalized: MetadataBlockInfo[] =
          MetadataFieldsHelper.replaceMetadataBlocksInfoDotNamesKeysWithSlash(blocksInfo)

        setAllMetadataBlocksInfo(metadataBlocksInfoNormalized)
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

    void handleGetInfo()
  }, [metadataBlockInfoRepository])

  return {
    allMetadataBlocksInfo,
    error,
    isLoading
  }
}
