import { useEffect, useState } from 'react'
import { getDatasetLocks } from '../../dataset/domain/useCases/getDatasetLocks' // Adjust the import path as necessary
import { Dataset } from '../../dataset/domain/models/Dataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { PUBLISH_DATASET_POLL_INTERVAL } from './config'
import { needsUpdateStore } from '@/notifications/domain/hooks/needsUpdateStore'

const useCheckPublishCompleted = (
  publishInProgress: boolean | undefined,
  dataset: Dataset | undefined,
  datasetRepository: DatasetRepository
): boolean => {
  const [publishCompleted, setPublishCompleted] = useState(false)

  const handlePublishCompleted = () => {
    setPublishCompleted(true)
    needsUpdateStore.setNeedsUpdate(true)
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    // `cancelled` latches once the first poll settles (success or
    // error) or the host unmounts. `inFlight` skips a tick while a
    // previous poll is still mid-await. Together they prevent two
    // failures: extra getLocks calls firing after the lock cleared,
    // and concurrent polls running because tick N+1 fired before
    // tick N's awaited fetch resolved.
    let cancelled = false
    let inFlight = false

    if (publishInProgress && dataset) {
      const waitForDatasetLocksReleased = async () => {
        const initialLocks = await getDatasetLocks(datasetRepository, dataset.persistentId)
        if (cancelled) return
        if (initialLocks.length === 0) {
          cancelled = true
          handlePublishCompleted()
        } else {
          intervalId = setInterval(() => {
            if (cancelled || inFlight) return
            inFlight = true
            void (async () => {
              try {
                const locks = await getDatasetLocks(datasetRepository, dataset.persistentId)
                if (cancelled) return
                if (locks.length === 0) {
                  cancelled = true
                  if (intervalId) clearInterval(intervalId)
                  handlePublishCompleted()
                }
              } catch (error) {
                if (cancelled) return
                cancelled = true
                if (intervalId) clearInterval(intervalId)
              } finally {
                inFlight = false
              }
            })()
          }, PUBLISH_DATASET_POLL_INTERVAL)
        }
      }
      void waitForDatasetLocksReleased()
    }

    return () => {
      cancelled = true
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [publishInProgress, dataset, datasetRepository])

  return publishCompleted
}
export default useCheckPublishCompleted
