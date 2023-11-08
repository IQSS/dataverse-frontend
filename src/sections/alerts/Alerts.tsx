import { Alert } from '@iqss/dataverse-design-system'

import { useTranslation } from 'react-i18next'
import styles from './Alerts.module.scss'
import parse from 'html-react-parser'
import { DatasetAlert } from '../../dataset/domain/models/Dataset'
import { useAlertContext } from '../dataset/DatasetAlertContext'

export function Alerts() {
  const { t } = useTranslation('dataset')
  const { datasetAlerts } = useAlertContext()
  return (
    <div className={styles.container}>
      {datasetAlerts.map((alert: DatasetAlert, index) => {
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
