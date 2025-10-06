import { useEffect, useState } from 'react'
import { getMetadataBlockInfoByCollectionId } from '../../../../metadata-block-info/domain/useCases/getMetadataBlockInfoByCollectionId'
import { getDisplayedOnCreateMetadataBlockInfoByCollectionId } from '../../../../metadata-block-info/domain/useCases/getDisplayedOnCreateMetadataBlockInfoByCollectionId'
import { MetadataBlockInfoRepository } from '../../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfo } from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { DatasetMetadataFormMode } from '.'
import { useSearchParams } from 'react-router-dom'
import { QueryParamKey } from '@/sections/Route.enum'

interface Props {
  mode: DatasetMetadataFormMode
  collectionId: string
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  datasetType?: string
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
  datasetType
}: Props): UseGetMetadataBlocksInfoReturn => {
  const [metadataBlocksInfo, setMetadataBlocksInfo] = useState<MetadataBlockInfo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const handleGetDatasetMetadataBlockFields = async () => {
      setIsLoading(true)
      try {
        let metadataBlocks: MetadataBlockInfo[] = []

        const datasetTypeIn = searchParams.get(QueryParamKey.DATASET_TYPE)
        if (datasetTypeIn) {
          datasetType = datasetTypeIn
        }
        if (mode === 'edit') {
          metadataBlocks = await getMetadataBlockInfoByCollectionId(
            metadataBlockInfoRepository,
            collectionId,
            false,
            datasetType
          )
        } else {
          metadataBlocks = await getDisplayedOnCreateMetadataBlockInfoByCollectionId(
            metadataBlockInfoRepository,
            collectionId,
            datasetType
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
  }, [collectionId, metadataBlockInfoRepository, mode])

  return {
    metadataBlocksInfo,
    error,
    isLoading
  }
}
