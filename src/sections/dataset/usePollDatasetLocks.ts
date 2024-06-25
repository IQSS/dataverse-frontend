import { useEffect, useRef } from 'react'
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
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (publishInPogress && dataset) {
      console.log('SETTING INTERVAL')
      const intervalId = setInterval(() => {
        const pollLocks = async () => {
          try {
            const locks = await getDatasetLocks(datasetRepository, dataset.persistentId)
            if (locks.length === 0) {
              console.log('navigating to released version')
              clearInterval(intervalId)
              navigate(`${Route.DATASETS}?persistentId=${dataset.persistentId}`, {
                state: { publishInProgress: false }
              })
            }
          } catch (error) {
            console.error('Error getting dataset locks:', error)
            clearInterval(intervalId)
          }
        }
        void pollLocks()
      }, 1000)
      intervalIdRef.current = intervalId

      return () => {
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current)
          intervalIdRef.current = null
        }
      }
    }
  }, [publishInPogress, dataset, datasetRepository, navigate])
}

export default usePollDatasetLocks
