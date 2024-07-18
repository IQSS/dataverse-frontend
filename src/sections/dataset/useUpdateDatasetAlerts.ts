import { useRef } from 'react'
import { Dataset } from '../../dataset/domain/models/Dataset' // Adjust the import path as necessary
import { AlertMessageKey } from '../../alert/domain/models/Alert'
import { useDeepCompareEffect } from 'use-deep-compare'
import { useAlertContext } from '../alerts/AlertContext'

interface UseUpdateDatasetAlertsProps {
  dataset?: Dataset
  created?: boolean
  metadataUpdated?: boolean
  publishInProgress?: boolean
}
function useUpdateDatasetAlerts({
  dataset,
  created,
  metadataUpdated,
  publishInProgress
}: UseUpdateDatasetAlertsProps) {
  const { setAlerts } = useAlertContext()
  const alertsInitialized = useRef(false)

  useDeepCompareEffect(() => {
    if (dataset?.alerts) {
      setAlerts(dataset.alerts)
      alertsInitialized.current = true
    }
    // 👇 Only to ignore setAlerts in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset?.alerts])

  useDeepCompareEffect(() => {
    if (created && alertsInitialized.current) {
      setAlerts((current) => {
        return [{ messageKey: AlertMessageKey.DATASET_CREATED, variant: 'success' }, ...current]
      })
    }
    // 👇 Only to ignore setAlerts in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [created, alertsInitialized.current])

  useDeepCompareEffect(() => {
    if (metadataUpdated && alertsInitialized.current) {
      setAlerts((current) => {
        return [{ messageKey: AlertMessageKey.METADATA_UPDATED, variant: 'success' }, ...current]
      })
    }
    // 👇 Only to ignore setAlerts in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadataUpdated, alertsInitialized.current])

  useDeepCompareEffect(() => {
    if (publishInProgress && alertsInitialized.current) {
      // If publishing, just show the publish in progress alert
      setAlerts([{ messageKey: AlertMessageKey.PUBLISH_IN_PROGRESS, variant: 'info' }])
    }
    // 👇 Only to ignore setAlerts in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishInProgress, alertsInitialized.current])
}

export default useUpdateDatasetAlerts
