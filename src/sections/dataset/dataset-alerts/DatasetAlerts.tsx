import { Alert } from '@iqss/dataverse-design-system'
import { DatasetAlert } from '../../../dataset/domain/models/Dataset'
import { useTranslation } from 'react-i18next'
import styles from './DatasetAlerts.module.scss'
import parse from 'html-react-parser'
import { useDatasetAlertContext } from '../DatasetAlertContext'

interface DatasetAlertsProps {
  alerts: DatasetAlert[]
}

export function DatasetAlerts({ alerts }: DatasetAlertsProps) {
  const { t } = useTranslation('dataset')
  const statusAlerts = useDatasetAlertContext()
  alerts = alerts.concat(statusAlerts.datasetAlerts)
  return (
    <div className={styles.container}>
      {alerts.map((alert: DatasetAlert, index) => {
        const translatedMsg = alert.dynamicFields
          ? t(`alerts.${alert.messageKey}.alertText`, alert.dynamicFields)
          : t(`alerts.${alert.messageKey}.alertText`)
        const translatedHeading = t(`alerts.${alert.messageKey}.heading`)
        const alertKey = `alert-${index}`
        return (
          <Alert
            key={alertKey}
            variant={alert.variant}
            customHeading={translatedHeading}
            dismissible={false}>
            {parse(translatedMsg)}
          </Alert>
        )
      })}
    </div>
  )
}
