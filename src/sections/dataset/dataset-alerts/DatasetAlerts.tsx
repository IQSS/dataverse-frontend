import { DatasetAlert } from '../../../dataset/domain/models/Dataset'
import { useTranslation } from 'react-i18next'
import { useDatasetAlertContext } from '../DatasetAlertContext'
import { Alerts } from '../../alerts/Alerts'

interface DatasetAlertsProps {
  alerts: DatasetAlert[]
}

export function DatasetAlerts({ alerts }: DatasetAlertsProps) {
  const statusAlerts = useDatasetAlertContext()
  alerts = alerts.concat(statusAlerts.datasetAlerts)
  return <Alerts alerts={alerts}></Alerts>
}
