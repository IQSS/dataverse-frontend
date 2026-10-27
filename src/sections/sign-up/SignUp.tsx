import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Tabs } from '@iqss/dataverse-design-system'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { useLoading } from '../../shared/contexts/loading/LoadingContext'
import { ValidTokenNotLinkedAccountForm } from './valid-token-not-linked-account-form/ValidTokenNotLinkedAccountForm'
import { BuiltinSignUpForm } from './builtin-sign-up-form/BuiltinSignUpForm'
import { requireAppConfig } from '@/config'
import styles from './SignUp.module.scss'

interface SignUpProps {
  dataverseInfoRepository: DataverseInfoRepository
  hasValidTokenButNotLinkedAccount: boolean
}

export const SignUp = ({
  dataverseInfoRepository,
  hasValidTokenButNotLinkedAccount
}: SignUpProps) => {
  const { t } = useTranslation('signUp')
  const { setIsLoading } = useLoading()
  const isSignUpEnabled = requireAppConfig().signUpEnabled === true

  useEffect(() => setIsLoading(false), [setIsLoading])

  return (
    <section data-testid="sign-up-page">
      <div className={styles['alert-container']}>
        {!hasValidTokenButNotLinkedAccount && (
          <Alert variant="info" customHeading={t('createAccount.heading')}>
            <span data-testid="default-create-account-alert-text">
              {t('createAccount.alertText')}
            </span>
          </Alert>
        )}

        {hasValidTokenButNotLinkedAccount && (
          <>
            <Alert variant="info" customHeading={t('hasValidTokenButNotLinkedAccount.heading')}>
              <span
                className={styles['not-linked-account-text']}
                data-testid="valid-token-not-linked-account-alert-text">
                {t('hasValidTokenButNotLinkedAccount.alertText')}
              </span>
            </Alert>
            <Alert variant="info">
              <span
                className={styles['not-linked-account-text']}
                data-testid="valid-token-not-linked-account-about-prefilled-fields">
                {t('aboutPrefilledFields')}
              </span>
            </Alert>
          </>
        )}
      </div>
      <header className={styles.header}>
        <h1>{t('pageTitle')}</h1>
      </header>

      <Tabs defaultActiveKey="accountInfo">
        <Tabs.Tab eventKey="accountInfo" title={t('accountInfo')}>
          <div className={styles['tab-container']}>
            {hasValidTokenButNotLinkedAccount && (
              <ValidTokenNotLinkedAccountForm dataverseInfoRepository={dataverseInfoRepository} />
            )}
            {!hasValidTokenButNotLinkedAccount && isSignUpEnabled && (
              <BuiltinSignUpForm dataverseInfoRepository={dataverseInfoRepository} />
            )}
          </div>
        </Tabs.Tab>
      </Tabs>
    </section>
  )
}
