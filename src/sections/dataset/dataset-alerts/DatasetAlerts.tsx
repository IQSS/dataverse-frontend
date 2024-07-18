import { useTranslation } from 'react-i18next'
import parse from 'html-react-parser'
import { Alert } from '@iqss/dataverse-design-system'
import { useAlertContext } from '../../alerts/AlertContext'
import styles from './DatasetAlerts.module.scss'

export function DatasetAlerts() {
  const { t } = useTranslation('dataset')
  const { alerts } = useAlertContext()

  if (!alerts.length) {
    return null
  }

  return (
    <div className={styles.container}>
      {alerts.map((alert, index) => {
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
