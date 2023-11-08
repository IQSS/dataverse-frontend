import { Alert as AlertComponent } from '@iqss/dataverse-design-system'

import { useTranslation } from 'react-i18next'
import styles from './Alerts.module.scss'
import parse from 'html-react-parser'
import { useAlertContext } from './AlertContext'
import { Alert } from '../../alert/domain/models/Alert'

export function Alerts() {
  const { t } = useTranslation('dataset')
  const { datasetAlerts } = useAlertContext()
  return (
    <div className={styles.container}>
      {datasetAlerts.map((alert: Alert, index) => {
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
