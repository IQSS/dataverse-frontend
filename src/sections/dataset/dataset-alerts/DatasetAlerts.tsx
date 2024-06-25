import { Alerts } from '../../alerts/Alerts'
import { Alert } from '../../../alert/domain/models/Alert'

interface DatasetAlertsProps {
  alerts: Alert[]
}

export function DatasetAlerts({ alerts }: DatasetAlertsProps) {
  console.log('DatasetAlerts', alerts)

  return <Alerts></Alerts>
}
