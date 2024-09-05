import { Trans, useTranslation } from 'react-i18next'
import { Button } from '@iqss/dataverse-design-system'
import accountStyles from '../Account.module.scss'
import styles from './ApiTokenSection.module.scss'

export const ApiTokenSection = () => {
  const { t } = useTranslation('account', { keyPrefix: 'apiToken' })

  const apiToken = '999fff-666rrr-12kfd54-123123'
  const expirationDate = '2025-09-04'

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiToken).catch((error) => {
      console.error('Failed to copy text:', error)
    })
  }

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
        {t('expirationDate')} <time dateTime={expirationDate}>{expirationDate}</time>
      </p>
      <div className={styles['api-token']}>
        <code>{apiToken}</code>
      </div>
      <div className={styles['btns-wrapper']} role="group">
        <Button variant="secondary" onClick={copyToClipboard}>
          {t('copyToClipboard')}
        </Button>
        <Button variant="secondary" disabled>
          {t('recreateToken')}
        </Button>
        <Button variant="secondary" disabled>
          {t('revokeToken')}
        </Button>
      </div>
    </>
  )
}
