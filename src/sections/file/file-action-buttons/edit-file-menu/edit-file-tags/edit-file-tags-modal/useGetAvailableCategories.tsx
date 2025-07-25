import { ReadError } from '@iqss/dataverse-client-javascript'
import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'

export interface UseGetAvailableCategories {
  datasetRepository: DatasetRepository
  datasetId: number | string
}

interface UseGetAvailableCategoriesReturn {
  availableCategories: string[]
  isLoading: boolean
  error: string | null
}

export const useGetAvailableCategories = ({
  datasetRepository,
  datasetId
}: UseGetAvailableCategories): UseGetAvailableCategoriesReturn => {
  const { t } = useTranslation('file')
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const getAvailableCategories = useCallback(
    async (datasetId: number | string) => {
      try {
        setIsLoading(true)
        const categories = await datasetRepository.getDatasetAvailableCategories(datasetId)
        console.log('Available categories in useCallback:', categories)
        setAvailableCategories(categories)
        setError(null)
      } catch (err: ReadError | unknown) {
        if (err instanceof ReadError) {
          const formattedError = new JSDataverseReadErrorHandler(err).getErrorMessage()
          setError(formattedError)
        } else {
          setError(t('defaultFileUpdateError'))
        }
      } finally {
        setIsLoading(false)
      }
    },
    [datasetRepository, t]
  )
  
  useEffect(() => {
    void getAvailableCategories(datasetId)
  }, [datasetId, getAvailableCategories])
  return { availableCategories, isLoading, error }
}
