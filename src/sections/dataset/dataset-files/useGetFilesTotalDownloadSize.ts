import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getFilesTotalDownloadSize } from '../../../files/domain/useCases/getFilesTotalDownloadSize'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'

type UseGetFilesTotalDownloadSizeParams = {
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  criteria?: FileCriteria
}

export const useGetFilesTotalDownloadSize = ({
  filesRepository,
  datasetPersistentId,
  datasetVersion,
  criteria
}: UseGetFilesTotalDownloadSizeParams) => {
  const { t } = useTranslation('files')
  const [filesTotalDownloadSize, setFilesTotalDownloadSize] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getTotalDownloadSize = useCallback(async () => {
    setIsLoading(true)

    try {
      const totalDownloadSize = await getFilesTotalDownloadSize(
        filesRepository,
        datasetPersistentId,
        datasetVersion.number,
        criteria
      )
      setFilesTotalDownloadSize(totalDownloadSize)
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : t('errorUnkownGetFilesTotalDownloadSize')
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [filesRepository, datasetPersistentId, datasetVersion.number, criteria, t])

  useEffect(() => {
    void getTotalDownloadSize()
  }, [getTotalDownloadSize])

  return {
    filesTotalDownloadSize,
    isLoading,
    error
  }
}
