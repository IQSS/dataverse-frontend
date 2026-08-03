import { useEffect, useState } from 'react'
import { getMetadataBlockInfoByCollectionId } from '../../../../metadata-block-info/domain/useCases/getMetadataBlockInfoByCollectionId'
import { getDisplayedOnCreateMetadataBlockInfoByCollectionId } from '../../../../metadata-block-info/domain/useCases/getDisplayedOnCreateMetadataBlockInfoByCollectionId'
import { MetadataBlockInfoRepository } from '../../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfo } from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { DatasetMetadataFormMode } from '.'
import { ExternalVocabularyRepository } from '@/external-vocabularies/domain/repositories/ExternalVocabularyRepository'
import { getConfiguredExternalVocabularies } from '@/external-vocabularies/domain/useCases/getConfiguredExternalVocabularies'
import { MetadataFieldsHelper } from './MetadataFieldsHelper'

interface Props {
  mode: DatasetMetadataFormMode
  collectionId: string
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  externalVocabularyRepository: ExternalVocabularyRepository
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
  externalVocabularyRepository
}: Props): UseGetMetadataBlocksInfoReturn => {
  const [metadataBlocksInfo, setMetadataBlocksInfo] = useState<MetadataBlockInfo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetDatasetMetadataBlockFields = async () => {
      setIsLoading(true)
      try {
        let metadataBlocks: MetadataBlockInfo[] = []

        const [metadataBlocksResponse, externalVocabularyConfigs] = await Promise.all([
          mode === 'edit'
            ? getMetadataBlockInfoByCollectionId(metadataBlockInfoRepository, collectionId)
            : getDisplayedOnCreateMetadataBlockInfoByCollectionId(
                metadataBlockInfoRepository,
                collectionId
              ),
          getConfiguredExternalVocabularies(externalVocabularyRepository)
        ])

        metadataBlocks = MetadataFieldsHelper.addExternalVocabularyConfigsToMetadataBlocksInfo(
          metadataBlocksResponse,
          externalVocabularyConfigs
        )

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
  }, [collectionId, externalVocabularyRepository, metadataBlockInfoRepository, mode])

  return {
    metadataBlocksInfo,
    error,
    isLoading
  }
}
