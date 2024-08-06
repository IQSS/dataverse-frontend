import { useEffect, useState } from 'react'
import { getDatasetLocks } from '../../dataset/domain/useCases/getDatasetLocks' // Adjust the import path as necessary
import { Dataset } from '../../dataset/domain/models/Dataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { PUBLISH_DATASET_POLL_INTERVAL } from './config'

const useCheckPublishCompleted = (
  publishInProgress: boolean | undefined,
  dataset: Dataset | undefined,
  datasetRepository: DatasetRepository
): boolean => {
  const [publishCompleted, setPublishCompleted] = useState(false)

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (publishInProgress && dataset) {
      const waitForDatasetLocksReleased = async () => {
        const initialLocks = await getDatasetLocks(datasetRepository, dataset.persistentId)
        if (initialLocks.length === 0) {
          setPublishCompleted(true)
        } else {
          intervalId = setInterval(() => {
            const pollLocks = async () => {
              try {
                const locks = await getDatasetLocks(datasetRepository, dataset.persistentId)
                if (locks.length === 0) {
                  if (intervalId) clearInterval(intervalId)
                  setPublishCompleted(true)
                }
              } catch (error) {
                if (intervalId) clearInterval(intervalId)
              }
            }
            void pollLocks()
          }, PUBLISH_DATASET_POLL_INTERVAL)
        }
      }
      void waitForDatasetLocksReleased()
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [publishInProgress, dataset, datasetRepository])

  return publishCompleted
}
export default useCheckPublishCompleted
