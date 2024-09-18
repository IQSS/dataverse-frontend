import { useEffect, useState } from 'react'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataField } from '../../metadata-block-info/domain/models/MetadataBlockInfo'
import { getAllFacetableMetadataFields } from '../../metadata-block-info/domain/useCases/getAllFacetableMetadataFields'

interface Props {
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

interface UseGetAllFacetableMetadataFieldsReturn {
  facetableMetadataFields: MetadataField[]
  error: string | null
  isLoading: boolean
}

export const useGetAllFacetableMetadataFields = ({
  metadataBlockInfoRepository
}: Props): UseGetAllFacetableMetadataFieldsReturn => {
  const [facetableMetadataFields, setFacetableMetadataFields] = useState<MetadataField[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetAllFacetableMetadataFields = async () => {
      setIsLoading(true)
      try {
        const facetableMetadataFieldsResponse: MetadataField[] =
          await getAllFacetableMetadataFields(metadataBlockInfoRepository)

        setFacetableMetadataFields(facetableMetadataFieldsResponse)
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting all the facetable metadata fields. Try again later.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    void handleGetAllFacetableMetadataFields()
  }, [metadataBlockInfoRepository])

  return {
    facetableMetadataFields,
    error,
    isLoading
  }
}
