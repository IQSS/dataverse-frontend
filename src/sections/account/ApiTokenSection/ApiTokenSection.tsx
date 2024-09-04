import { Trans, useTranslation } from 'react-i18next'
import accountStyles from '../Account.module.scss'
import styles from './ApiTokenSection.module.scss'

export const ApiTokenSection = () => {
  const { t } = useTranslation('account', { keyPrefix: 'apiToken' })

  return (
    <>
      <p className={accountStyles['helper-text']}>
        <Trans
          t={t}
          i18nKey="helperText"
          components={{
            anchor: (
              <a
                href="http://guides.dataverse.org/en/latest/api"
                target="_blank"
                rel="noreferrer"
              />
            )
          }}
        />
      </p>
      <p className={styles['exp-date']}>
        Expiration Date <time dateTime="2024-05-03">2025-09-04</time>
      </p>
    </>
  )
}
