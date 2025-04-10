import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Tabs } from '@iqss/dataverse-design-system'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { useLoading } from '../loading/LoadingContext'
import { ValidTokenNotLinkedAccountForm } from './valid-token-not-linked-account-form/ValidTokenNotLinkedAccountForm'
import styles from './SignUp.module.scss'

// TODO:ME - E2E test failing in CI -
// performs different search, filtering and respond to back and forward navigation. Timed out retrying after 10000ms: Expected to find content: 'Volta' within the element: <article._card-main-container_949f1_37> but never did.
// should upload 2 files and add it to the dataset - Error: Network Error
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
