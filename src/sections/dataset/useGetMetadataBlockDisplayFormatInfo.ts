import { useEffect, useState } from 'react'
import { MetadataBlockInfoDisplayFormat } from '../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { getMetadataBlockInfoByName } from '../../metadata-block-info/domain/useCases/getMetadataBlockInfoByName'
import { ExternalVocabularyRepository } from '@/external-vocabularies/domain/repositories/ExternalVocabularyRepository'
import { getConfiguredExternalVocabularies } from '@/external-vocabularies/domain/useCases/getConfiguredExternalVocabularies'
import { MetadataFieldsHelper } from '@/sections/shared/form/DatasetMetadataForm/MetadataFieldsHelper'

interface Props {
  metadataBlockName: string
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  externalVocabularyRepository: ExternalVocabularyRepository
}

interface UseGetMetadataBlocksDisplayFormatInfoReturn {
  metadataBlockDisplayFormatInfo: MetadataBlockInfoDisplayFormat | undefined
  error: string | null
  isLoading: boolean
}

export const useGetMetadataBlockDisplayFormatInfo = ({
  metadataBlockName,
  metadataBlockInfoRepository,
  externalVocabularyRepository
}: Props): UseGetMetadataBlocksDisplayFormatInfoReturn => {
  const [metadataBlockDisplayFormatInfo, setMetadataBlockDisplayFormatInfo] =
    useState<MetadataBlockInfoDisplayFormat>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetMetadatBlockInfoByName = async () => {
      setIsLoading(true)
      try {
        const [response, externalVocabularyConfigs] = await Promise.all([
          getMetadataBlockInfoByName(metadataBlockInfoRepository, metadataBlockName),
          getConfiguredExternalVocabularies(externalVocabularyRepository)
        ])

        setMetadataBlockDisplayFormatInfo(
          MetadataFieldsHelper.addExternalVocabularyConfigsToMetadataBlockDisplayFormatInfo(
            response,
            externalVocabularyConfigs
          )
        )
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
  }, [externalVocabularyRepository, metadataBlockInfoRepository, metadataBlockName])

  return {
    metadataBlockDisplayFormatInfo,
    error,
    isLoading
  }
}
