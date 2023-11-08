import { useAlertContext } from '../DatasetAlertContext'
import { Alerts } from '../../alerts/Alerts'
import { Alert } from '../../../alert/domain/models/Alert'

interface DatasetAlertsProps {
  alerts: Alert[]
}

export function DatasetAlerts({ alerts }: DatasetAlertsProps) {
  const { addDatasetAlert } = useAlertContext()
  alerts.forEach((alert) => addDatasetAlert(alert))
  return <Alerts></Alerts>
}
