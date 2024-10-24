import { Trans, useTranslation } from 'react-i18next'
import { Button } from '@iqss/dataverse-design-system'
import accountStyles from '../Account.module.scss'
import styles from './ApiTokenSection.module.scss'
import { useEffect, useState } from 'react'
import { TokenInfo } from '@/users/domain/models/TokenInfo'
import { recreateApiToken } from '@/users/domain/useCases/recreateApiToken'
import { revokeApiToken } from '@/users/domain/useCases/revokeApiToken'
import { ApiTokenInfoRepository } from '@/users/domain/repositories/ApiTokenInfoRepository'
import ApiTokenSectionSkeleton from './ApiTokenSectionSkeleton'
import { useGetApiToken } from './useGetCurrentApiToken'
import { useLoading } from '../../loading/LoadingContext'

interface ApiTokenSectionProps {
  repository: ApiTokenInfoRepository
}

export const ApiTokenSection = ({ repository }: ApiTokenSectionProps) => {
  const { t } = useTranslation('account', { keyPrefix: 'apiToken' })
  const { isLoading, setIsLoading } = useLoading()
  const [isRevoke, setIsRevoke] = useState<boolean>(false)
  const { error, apiTokenInfo, isLoading: isLoadingData } = useGetApiToken(repository)
  const [currentApiTokenInfo, setCurrentApiTokenInfo] = useState<TokenInfo>(apiTokenInfo)

  useEffect(() => {
    setCurrentApiTokenInfo(apiTokenInfo)
  }, [apiTokenInfo])

  const handleCreateToken = () => {
    setIsLoading(true)
    recreateApiToken(repository)
      .then((tokenInfo) => {
        setCurrentApiTokenInfo(tokenInfo)
      })
      .catch((error) => {
        console.error('There was an error fetching recreated Api token:', error)
      })
      .finally(() => {
        setIsLoading(false)
        setIsRevoke(false)
      })
  }

  const handleRevokeToken = () => {
    revokeApiToken(repository)
      .then()
      .catch((error) => {
        console.error('There was an error revoking Api token:', error)
      })
      .finally(() => {
        setCurrentApiTokenInfo({ apiToken: '', expirationDate: '' })
        setIsRevoke(true)
        setIsRevoke(true)
      })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiTokenInfo.apiToken).catch(
      /* istanbul ignore next */ (error) => {
        console.error('Failed to copy text:', error)
      }
    )
  }

  if (isLoadingData) {
    return <ApiTokenSectionSkeleton data-testid="loadingSkeleton" />
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
      {!isRevoke && currentApiTokenInfo.apiToken ? (
        <>
          <p className={styles['exp-date']}>
            {t('expirationDate')}{' '}
            <time data-testid="expiration-date" dateTime={currentApiTokenInfo.expirationDate}>
              {currentApiTokenInfo.expirationDate}
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
