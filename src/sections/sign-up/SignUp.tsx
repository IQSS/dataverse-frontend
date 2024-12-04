import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Tabs } from '@iqss/dataverse-design-system'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { useLoading } from '../loading/LoadingContext'
import { ValidTokenNotLinkedAccountForm } from './valid-token-not-linked-account-form/ValidTokenNotLinkedAccountForm'
import styles from './SignUp.module.scss'

// TODO:ME - All use cases will return same error message so this is blocking us for making requests to other public use cases like get root collection, should work removing access token from localstorage but we need it for future call

interface SignUpProps {
  userRepository: UserRepository
  hasValidTokenButNotLinkedAccount: boolean
}

export const SignUp = ({ userRepository, hasValidTokenButNotLinkedAccount }: SignUpProps) => {
  const { t } = useTranslation('signUp')
  const { setIsLoading } = useLoading()

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
              <ValidTokenNotLinkedAccountForm userRepository={userRepository} />
            )}
          </div>
        </Tabs.Tab>
      </Tabs>
    </section>
  )
}
