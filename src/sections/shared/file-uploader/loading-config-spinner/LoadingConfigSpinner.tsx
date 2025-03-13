import { useTranslation } from 'react-i18next'
import { Spinner } from '@iqss/dataverse-design-system'
import styles from './LoadingConfigSpinner.module.scss'

export const LoadingConfigSpinner = () => {
  const { t } = useTranslation('shared', { keyPrefix: 'fileUploader' })

  return (
    <div className={styles.loading_config}>
      <Spinner animation="border" variant="primary" />
      <span>
        {t('loadingConfiguration')}{' '}
        <span className={styles.dots}>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </span>
    </div>
  )
}
