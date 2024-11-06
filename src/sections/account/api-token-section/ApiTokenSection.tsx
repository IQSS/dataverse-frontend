import { Trans, useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useGetApiToken } from './useGetCurrentApiToken'
import { useRecreateApiToken } from './useRecreateApiToken'
import { useRevokeApiToken } from './useRevokeApiToken'
import { ApiTokenSectionSkeleton } from './ApiTokenSectionSkeleton'
import { TokenInfo } from '@/users/domain/models/TokenInfo'
import { DateHelper } from '@/shared/helpers/DateHelper'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { Button } from '@iqss/dataverse-design-system'
import { Alert } from '@iqss/dataverse-design-system'
import accountStyles from '../Account.module.scss'
import styles from './ApiTokenSection.module.scss'

interface ApiTokenSectionProps {
  repository: UserRepository
}

export const ApiTokenSection = ({ repository }: ApiTokenSectionProps) => {
  const { t } = useTranslation('account', { keyPrefix: 'apiToken' })
  const [currentApiTokenInfo, setCurrentApiTokenInfo] = useState<TokenInfo>()

  const { error: getError, apiTokenInfo, isLoading } = useGetApiToken(repository)

  useEffect(() => {
    setCurrentApiTokenInfo(apiTokenInfo)
  }, [apiTokenInfo])

  const {
    recreateToken,
    isRecreating,
    error: recreatingError,
    apiTokenInfo: updatedTokenInfo
  } = useRecreateApiToken(repository)

  useEffect(() => {
    if (updatedTokenInfo) {
      setCurrentApiTokenInfo(updatedTokenInfo)
    }
  }, [updatedTokenInfo])

  const handleCreateToken = () => {
    void recreateToken()
  }

  const { revokeToken, isRevoking, error: revokingError } = useRevokeApiToken(repository)

  const handleRevokeToken = async () => {
    await revokeToken()
    setCurrentApiTokenInfo({
      apiToken: '',
      expirationDate: new Date(0)
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiTokenInfo.apiToken).catch(
      /* istanbul ignore next */ (error) => {
        console.error('Failed to copy text:', error)
      }
    )
  }

  if (isLoading || isRecreating || isRevoking) {
    return <ApiTokenSectionSkeleton data-testid="loadingSkeleton" />
  }

  if (getError || recreatingError || revokingError) {
    return (
      <Alert variant="danger" dismissible={false}>
        {getError || recreatingError || revokingError}
      </Alert>
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
      {currentApiTokenInfo?.apiToken ? (
        <>
          <p className={styles['exp-date']}>
            {t('expirationDate')}{' '}
            <time
              data-testid="expiration-date"
              dateTime={DateHelper.toISO8601Format(currentApiTokenInfo.expirationDate)}>
              {DateHelper.toISO8601Format(currentApiTokenInfo.expirationDate)}
            </time>
          </p>
          <div className={styles['api-token']}>
            <code data-testid="api-token">{currentApiTokenInfo.apiToken}</code>
          </div>
          <div className={styles['btns-wrapper']} role="group">
            <Button variant="secondary" onClick={copyToClipboard}>
              {t('copyToClipboard')}
            </Button>
            <Button variant="secondary" onClick={handleCreateToken}>
              {t('recreateToken')}
            </Button>
            <Button variant="secondary" onClick={handleRevokeToken}>
              {t('revokeToken')}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className={styles['api-token']}>
            <code data-testid="api-token">{t('notCreatedApiToken')}</code>
          </div>
          <div className={styles['btns-wrapper']} data-testid="noApiToken" role="group">
            <Button data-testid="createApi" variant="secondary" onClick={handleCreateToken}>
              {t('createToken')}
            </Button>
          </div>
        </>
      )}
    </>
  )
}
