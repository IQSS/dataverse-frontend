import { ReadError } from '@iqss/dataverse-client-javascript'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { getDatasetAvailableCategories } from '@/dataset/domain/useCases/getDatasetAvailableCategories'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'

export interface UseGetAvailableCategories {
  datasetRepository: DatasetRepository
  datasetId: number | string
}

export const useGetAvailableCategories = ({
  datasetRepository,
  datasetId
}: UseGetAvailableCategories) => {
  const { t } = useTranslation('file')
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getAvailableCategories = async (datasetId: number | string) => {
      try {
        const categories = await getDatasetAvailableCategories(datasetRepository, datasetId)
        setAvailableCategories(categories)
        setError(null)
      } catch (err: ReadError | unknown) {
        if (err instanceof ReadError) {
          const formattedError = new JSDataverseReadErrorHandler(err).getErrorMessage()
          setError(formattedError)
        } else {
          setError(t('getCategoriesError'))
        }
      } finally {
        setIsLoading(false)
        setError(null)
      }
    }

    void getAvailableCategories(datasetId)
  }, [datasetRepository, datasetId, t])

  return { availableCategories, isLoading, error }
}
