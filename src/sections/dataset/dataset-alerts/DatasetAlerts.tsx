import { DatasetAlert } from '../../../dataset/domain/models/Dataset'
import { useAlertContext } from '../DatasetAlertContext'
import { Alerts } from '../../alerts/Alerts'

interface DatasetAlertsProps {
  alerts: DatasetAlert[]
}

export function DatasetAlerts({ alerts }: DatasetAlertsProps) {
  const { addDatasetAlert } = useAlertContext()
  alerts.forEach((alert) => addDatasetAlert(alert))
  return <Alerts></Alerts>
}
