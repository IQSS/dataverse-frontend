import { useTranslation } from 'react-i18next'
import parse from 'html-react-parser'
import { Alert as AlertComponent } from '@iqss/dataverse-design-system'
import { Alert } from '../../../alert/domain/models/Alert'
import styles from './DatasetAlerts.module.scss'

interface DatasetAlertsProps {
  alerts: Alert[]
}

export function DatasetAlerts({ alerts }: DatasetAlertsProps) {
  const { t } = useTranslation('dataset')

  return (
    <div className={styles.container}>
      {alerts.map((alert: Alert, index) => {
        const translatedMsg = alert.dynamicFields
          ? t(`alerts.${alert.messageKey}.alertText`, alert.dynamicFields)
          : t(`alerts.${alert.messageKey}.alertText`)
        const translatedHeading = t(`alerts.${alert.messageKey}.heading`)
        const alertKey = `alert-${index}`

        return (
          <AlertComponent
            key={alertKey}
            variant={alert.variant}
            customHeading={translatedHeading}
            dismissible={false}>
            {parse(translatedMsg)}
          </AlertComponent>
        )
      })}
    </div>
  )
}
