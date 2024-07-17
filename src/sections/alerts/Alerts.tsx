import { Alert as AlertComponent } from '@iqss/dataverse-design-system'

import { useTranslation } from 'react-i18next'
import styles from './Alerts.module.scss'
import parse from 'html-react-parser'
import { Alert } from '../../alert/domain/models/Alert'

export function Alerts({ alerts }: { alerts: Alert[] }) {
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
