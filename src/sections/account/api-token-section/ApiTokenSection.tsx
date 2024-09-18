import { Trans, useTranslation } from 'react-i18next'
import { Button } from '@iqss/dataverse-design-system'
import accountStyles from '../Account.module.scss'
import styles from './ApiTokenSection.module.scss'

export const ApiTokenSection = () => {
  const { t } = useTranslation('account', { keyPrefix: 'apiToken' })

  // TODO: When we have the use cases we need to mock stub to unit test this with or without token
  const apiToken = '999fff-666rrr-this-is-not-a-real-token-123456'
  const expirationDate = '2025-09-04'

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiToken).catch(
      /* istanbul ignore next */ (error) => {
        console.error('Failed to copy text:', error)
      }
    )
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
      {apiToken ? (
        <>
          <p className={styles['exp-date']}>
            {t('expirationDate')} <time dateTime={expirationDate}>{expirationDate}</time>
          </p>
          <div className={styles['api-token']}>
            <code data-testid="api-token">{apiToken}</code>
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
      ) : (
        <>
          <div className={styles['api-token']}>
            <code data-testid="api-token">{t('notCreatedApiToken')}</code>
          </div>
          <div className={styles['btns-wrapper']} role="group">
            <Button variant="secondary" disabled>
              {t('createToken')}
            </Button>
          </div>
        </>
      )}
    </>
  )
}
