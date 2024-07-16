import { useAlertContext } from '../../alerts/AlertContext'
import { Alerts } from '../../alerts/Alerts'
import { Alert } from '../../../alert/domain/models/Alert'
import { useEffect } from 'react'

interface DatasetAlertsProps {
  alerts: Alert[]
}

export function DatasetAlerts({ alerts }: DatasetAlertsProps) {
  const { addDatasetAlert } = useAlertContext()
  useEffect(() => {
    alerts.forEach((alert) => addDatasetAlert(alert))
  }, [addDatasetAlert, alerts])

  return <Alerts></Alerts>
}
