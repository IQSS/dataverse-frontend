import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { getDatasetVersionDiff } from '@/dataset/domain/useCases/getDatasetVersionDiff'
import { DatasetVersionDiff } from '@/dataset/domain/models/DatasetVersionDiff'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'

interface UseGetDatasetVersionDiff {
  differences: DatasetVersionDiff | undefined
  error: string | null
  isLoading: boolean
}

interface getDatasetVersionDiffProps {
  datasetRepository: DatasetRepository
  persistentId: string
  oldVersion: string
  newVersion: string
}

export const useGetDatasetVersionDiff = ({
  datasetRepository,
  persistentId,
  oldVersion,
  newVersion
}: getDatasetVersionDiffProps): UseGetDatasetVersionDiff => {
  const { t } = useTranslation('dataset')
  const [differences, setDifferences] = useState<DatasetVersionDiff>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetDatasetVersionDiff = async () => {
      setIsLoading(true)
      try {
        const response = await getDatasetVersionDiff(
          datasetRepository,
          persistentId,
          oldVersion,
          newVersion == 'DRAFT' ? ':draft' : newVersion
        )
        setDifferences(response)
      } catch (err: ReadError | unknown) {
        if (err instanceof ReadError) {
          const error = new JSDataverseWriteErrorHandler(err)
          const formattedError =
            error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()
          setError(formattedError)
        }
      } finally {
        setIsLoading(false)
      }
    }

    console.log('handleGetDatasetVersionDiff', error)
    void handleGetDatasetVersionDiff()
  }, [newVersion, oldVersion])

  return {
    differences,
    error,
    isLoading
  }
}
