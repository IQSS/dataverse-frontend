import { useRef } from 'react'
import { useDeepCompareEffect } from 'use-deep-compare'
import { Dataset } from '../../dataset/domain/models/Dataset'
import { AlertMessageKey } from '../../alert/domain/models/Alert'
import { useAlertContext } from '../alerts/AlertContext'

interface UseUpdateDatasetAlertsProps {
  dataset?: Dataset
  publishInProgress?: boolean
}
function useUpdateDatasetAlerts({ dataset, publishInProgress }: UseUpdateDatasetAlertsProps) {
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
    if (publishInProgress && alertsInitialized.current) {
      // If publishing, just show the publish in progress alert
      setAlerts([{ messageKey: AlertMessageKey.PUBLISH_IN_PROGRESS, variant: 'info' }])
    }
    // 👇 Only to ignore setAlerts in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishInProgress, alertsInitialized.current])
}

export default useUpdateDatasetAlerts
