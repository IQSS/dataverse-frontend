import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDatasetLocks } from '../../dataset/domain/useCases/getDatasetLocks' // Adjust the import path as necessary
import { Route } from '../Route.enum'
import { Dataset } from '../../dataset/domain/models/Dataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'

const usePollDatasetLocks = (
  publishInPogress: boolean | undefined,
  dataset: Dataset | undefined,
  datasetRepository: DatasetRepository
) => {
  const navigate = useNavigate()
  const navigateToDataset = (persistentId: string) => {
    navigate(`${Route.DATASETS}?persistentId=${persistentId}`, {
      state: { publishInProgress: false }
    })
  }

  useEffect(() => {
    if (publishInPogress && dataset) {
      const gotoReleasedPageAfterPublish = async () => {
        const initialLocks = await getDatasetLocks(datasetRepository, dataset.persistentId)
        console.log('initial locks:', JSON.stringify(initialLocks))
        if (initialLocks.length === 0) {
          navigateToDataset(dataset.persistentId)
        } else {
          const intervalId = setInterval(() => {
            console.log('polling locks')
            const pollLocks = async () => {
              try {
                const locks = await getDatasetLocks(datasetRepository, dataset.persistentId)
                if (locks.length === 0) {
                  console.log('navigating to released version')
                  clearInterval(intervalId)
                  navigateToDataset(dataset.persistentId)
                }
              } catch (error) {
                console.error('Error getting dataset locks:', error)
                clearInterval(intervalId)
              }
            }
            void pollLocks()
          }, 2000)
        }
      }
      void gotoReleasedPageAfterPublish()
    }
  }, [publishInPogress, dataset, datasetRepository, navigate])
}

export default usePollDatasetLocks
