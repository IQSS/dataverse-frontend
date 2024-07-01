import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDatasetLocks } from '../../dataset/domain/useCases/getDatasetLocks' // Adjust the import path as necessary
import { Route } from '../Route.enum'
import { Dataset } from '../../dataset/domain/models/Dataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { useAlertContext } from '../alerts/AlertContext'
import { AlertMessageKey } from '../../alert/domain/models/Alert'

const usePollDatasetLocks = (
  publishInProgress: boolean | undefined,
  dataset: Dataset | undefined,
  datasetRepository: DatasetRepository
) => {
  const navigate = useNavigate()
  const { removeDatasetAlert, addDatasetAlert } = useAlertContext()

  const navigateToPublishedDataset = (persistentId: string) => {
    removeDatasetAlert(AlertMessageKey.PUBLISH_IN_PROGRESS)
    navigate(`${Route.DATASETS}?persistentId=${persistentId}`, {
      state: { publishInProgress: false }
    })
  }
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (publishInProgress && dataset) {
      addDatasetAlert({ messageKey: AlertMessageKey.PUBLISH_IN_PROGRESS, variant: 'info' })
      removeDatasetAlert(AlertMessageKey.DRAFT_VERSION)
      const gotoReleasedPageAfterPublish = async () => {
        const initialLocks = await getDatasetLocks(datasetRepository, dataset.persistentId)
        console.log('initial locks:', JSON.stringify(initialLocks))
        if (initialLocks.length === 0) {
          navigateToPublishedDataset(dataset.persistentId)
        } else {
          intervalId = setInterval(() => {
            console.log('polling locks')
            const pollLocks = async () => {
              try {
                const locks = await getDatasetLocks(datasetRepository, dataset.persistentId)
                if (locks.length === 0) {
                  if (intervalId) clearInterval(intervalId)
                  navigateToPublishedDataset(dataset.persistentId)
                }
              } catch (error) {
                if (intervalId) clearInterval(intervalId)
              }
            }
            void pollLocks()
          }, 2000)
        }
      }
      void gotoReleasedPageAfterPublish()
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [publishInProgress, dataset, datasetRepository, navigate])
}
export default usePollDatasetLocks
