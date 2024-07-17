import { useState, useEffect } from 'react'
import { Dataset } from '../../dataset/domain/models/Dataset' // Adjust the import path as necessary
import { Alert, AlertMessageKey } from '../../alert/domain/models/Alert'
import { useDeepCompareEffect } from 'use-deep-compare'
import { useNavigate } from 'react-router-dom'
import { Route } from '../Route.enum'

function useDatasetAlerts(
  created: boolean | undefined,
  metadataUpdated: boolean | undefined,
  dataset: Dataset | undefined,
  publishInProgress: boolean | undefined,
  publishCompleted: boolean | undefined
) {
  const navigate = useNavigate()
  const [datasetAlerts, setDatasetAlerts] = useState<Alert[]>([])
  useDeepCompareEffect(() => {
    if (dataset?.alerts) {
      console.log(
        '%cSetting initial dataset alerts',
        'background: red; color: white; padding: 2px;'
      )
      setDatasetAlerts(dataset.alerts)
    }
  }, [dataset?.alerts])
  useEffect(() => {
    if (dataset) {
      if (publishInProgress && !publishCompleted) {
        setDatasetAlerts((prevAlerts) => {
          const publishInProgressAdded = prevAlerts.some(
            (alert) => alert.messageKey === AlertMessageKey.PUBLISH_IN_PROGRESS
          )
          if (publishInProgressAdded) return prevAlerts

          return [{ messageKey: AlertMessageKey.PUBLISH_IN_PROGRESS, variant: 'info' }]
        })
      }
      if (publishInProgress && publishCompleted) {
        navigate(`${Route.DATASETS}?persistentId=${dataset.persistentId}`, {
          state: { publishInProgress: false },
          replace: true
        })
      }
    }
  }, [dataset, publishInProgress, publishCompleted, navigate])
  useEffect(() => {
    if (created && dataset) {
      setDatasetAlerts((prevAlerts) => {
        const datasetCreatedAdded = prevAlerts.some(
          (alert) => alert.messageKey === AlertMessageKey.DATASET_CREATED
        )
        if (datasetCreatedAdded) return prevAlerts
        return [...prevAlerts, { messageKey: AlertMessageKey.DATASET_CREATED, variant: 'success' }]
      })
    }
    if (metadataUpdated && dataset) {
      setDatasetAlerts((prevAlerts) => {
        const metadataUpdatedAdded = prevAlerts.some(
          (alert) => alert.messageKey === AlertMessageKey.METADATA_UPDATED
        )
        if (metadataUpdatedAdded) return prevAlerts
        return [...prevAlerts, { messageKey: AlertMessageKey.METADATA_UPDATED, variant: 'success' }]
      })
    }
    if (publishInProgress && dataset) {
      setDatasetAlerts((prevAlerts) => {
        const publishInProgressAdded = prevAlerts.some(
          (alert) => alert.messageKey === AlertMessageKey.PUBLISH_IN_PROGRESS
        )
        if (publishInProgressAdded) return prevAlerts
        return [{ messageKey: AlertMessageKey.PUBLISH_IN_PROGRESS, variant: 'info' }]
      })
    }
  }, [created, metadataUpdated, dataset, publishInProgress])

  return datasetAlerts
}

export default useDatasetAlerts
