import { useEffect, useState } from 'react'
import { getMetadataBlockInfoByCollectionId } from '../../metadata-block-info/domain/useCases/getMetadataBlockInfoByCollectionId'
import { getDisplayedOnCreateMetadataBlockInfoByCollectionId } from '../../metadata-block-info/domain/useCases/getDisplayedOnCreateMetadataBlockInfoByCollectionId'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfo } from '../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataFieldsHelper } from './MetadataFieldsHelper'

interface Props {
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  collectionId: string
  mode: 'create' | 'edit'
}

interface UseGetMetadataBlocksInfoReturn {
  metadataBlocks: MetadataBlockInfo[]
  error: string | null
  isLoading: boolean
}

export const useGetMetadataBlocksInfo = ({
  metadataBlockInfoRepository,
  collectionId,
  mode
}: Props): UseGetMetadataBlocksInfoReturn => {
  const [metadataBlocks, setMetadataBlocks] = useState<MetadataBlockInfo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const onCreateMode = mode === 'create'

  useEffect(() => {
    const handleGetDatasetMetadataBlockFields = async () => {
      setIsLoading(true)
      try {
        let metadataBlocksInfo: MetadataBlockInfo[]

        if (onCreateMode) {
          metadataBlocksInfo = await getDisplayedOnCreateMetadataBlockInfoByCollectionId(
            metadataBlockInfoRepository,
            collectionId
          )
        } else {
          metadataBlocksInfo = await getMetadataBlockInfoByCollectionId(
            metadataBlockInfoRepository,
            collectionId
          )
        }

        const mappedMetadataBlocks =
          MetadataFieldsHelper.replaceDotNamesKeysWithSlash(metadataBlocksInfo)

        setMetadataBlocks(mappedMetadataBlocks)
      } catch (err) {
        console.error(err)
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the information from the metadata blocks. Try again later.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }
    void handleGetDatasetMetadataBlockFields()
  }, [collectionId, metadataBlockInfoRepository, onCreateMode])

  return {
    metadataBlocks,
    error,
    isLoading
  }
}
