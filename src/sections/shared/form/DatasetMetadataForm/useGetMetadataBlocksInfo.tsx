import { useEffect, useState } from 'react'
import { getMetadataBlockInfoByCollectionId } from '../../../../metadata-block-info/domain/useCases/getMetadataBlockInfoByCollectionId'
import { getDisplayedOnCreateMetadataBlockInfoByCollectionId } from '../../../../metadata-block-info/domain/useCases/getDisplayedOnCreateMetadataBlockInfoByCollectionId'
import { MetadataBlockInfoRepository } from '../../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfo } from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { DatasetType } from '@/dataset/domain/models/DatasetType'
import { DatasetMetadataFormMode } from '.'

interface Props {
  mode: DatasetMetadataFormMode
  collectionId: string
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  datasetTypeName?: DatasetType['name']
}

interface UseGetMetadataBlocksInfoReturn {
  metadataBlocksInfo: MetadataBlockInfo[]
  error: string | null
  isLoading: boolean
}

export const useGetMetadataBlocksInfo = ({
  mode,
  collectionId,
  metadataBlockInfoRepository,
  datasetTypeName
}: Props): UseGetMetadataBlocksInfoReturn => {
  const [metadataBlocksInfo, setMetadataBlocksInfo] = useState<MetadataBlockInfo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetDatasetMetadataBlockFields = async () => {
      setIsLoading(true)
      try {
        let metadataBlocks: MetadataBlockInfo[] = []

        if (mode === 'edit') {
          metadataBlocks = await getMetadataBlockInfoByCollectionId(
            metadataBlockInfoRepository,
            collectionId,
            false,
            datasetTypeName
          )
        } else {
          metadataBlocks = await getDisplayedOnCreateMetadataBlockInfoByCollectionId(
            metadataBlockInfoRepository,
            collectionId,
            datasetTypeName
          )
        }

        setMetadataBlocksInfo(metadataBlocks)
      } catch (err) {
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
  }, [collectionId, metadataBlockInfoRepository, mode, datasetTypeName])

  return {
    metadataBlocksInfo,
    error,
    isLoading
  }
}
