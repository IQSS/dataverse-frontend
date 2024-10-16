import { Trans, useTranslation } from 'react-i18next'
import { Button } from '@iqss/dataverse-design-system'
import accountStyles from '../Account.module.scss'
import styles from './ApiTokenSection.module.scss'
import { useEffect, useMemo, useState } from 'react'
import { TokenInfo } from '@/api-token-info/domain/models/TokenInfo'
import { readCurrentApiToken } from '@/api-token-info/domain/useCases/readCurrentApiToken'
import { ApiTokenInfoJSDataverseRepository } from '@/api-token-info/infrastructure/ApiTokenInfoJSDataverseRepository'
import ApiTokenSectionSkeleton from './ApiTokenSectionSkeleton'
export const ApiTokenSection = () => {
  const { t } = useTranslation('account', { keyPrefix: 'apiToken' })

  // TODO: When we have the use cases we need to mock stub to unit test this with or without token
  const [apiToken, setApiToken] = useState<TokenInfo['apiToken']>('')
  const [expirationDate, setExpirationDate] = useState<TokenInfo['expirationDate']>('')
  const [loading, setLoading] = useState(true)
  const repository = useMemo(() => new ApiTokenInfoJSDataverseRepository(), [])

  useEffect(() => {
    setLoading(true)
    readCurrentApiToken(repository)
      .then((tokenInfo) => {
        if (tokenInfo) {
          setApiToken(tokenInfo.apiToken)
          setExpirationDate(tokenInfo.expirationDate)
        }
      })
      .catch((error) => {
        console.error('There was an error fetching current Api token:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [repository])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiToken).catch(
      /* istanbul ignore next */ (error) => {
        console.error('Failed to copy text:', error)
      }
    )
  }
  if (loading) {
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
        <ApiTokenSectionSkeleton data-testid="loadingSkeleton" />
      </>
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
            {t('expirationDate')}{' '}
            <time data-testid="expiration-date" dateTime={expirationDate}>
              {expirationDate}
            </time>
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
