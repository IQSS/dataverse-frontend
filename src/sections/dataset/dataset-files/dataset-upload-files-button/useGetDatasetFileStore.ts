import { useEffect, useState } from 'react'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'

export const useGetDatasetFileStore = (datasetId?: number) => {
  const [datasetFileStore, setDatasetFileStore] = useState<string | undefined>(undefined)
  const [isLoadingDatasetFileStore, setIsLoadingDatasetFileStore] = useState<boolean>(true)
  const [errorLoadingDatasetFileStore, setErrorLoadingDatasetFileStore] = useState<string | null>(
    null
  )

  useEffect(() => {
    const handleGetDatasetFileStore = async () => {
      if (!datasetId) return
      setIsLoadingDatasetFileStore(true)

      try {
        const storeName = await DatasetJSDataverseRepository.getFileStore(datasetId)
        setDatasetFileStore(storeName)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error fetching file store'
        setErrorLoadingDatasetFileStore(errorMessage)
      } finally {
        setIsLoadingDatasetFileStore(false)
      }
    }

    void handleGetDatasetFileStore()
  }, [datasetId])

  return { datasetFileStore, isLoadingDatasetFileStore, errorLoadingDatasetFileStore }
}
