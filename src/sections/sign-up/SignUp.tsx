import { useTranslation } from 'react-i18next'
import { Alert, Tabs } from '@iqss/dataverse-design-system'
import styles from './SignUp.module.scss'
import { useEffect } from 'react'
import { useLoading } from '../loading/LoadingContext'
import { ValidTokenNotLinkedAccountForm } from './valid-token-not-linked-account-form/ValidTokenNotLinkedAccountForm'

// const collectionRepository = new CollectionJSDataverseRepository()
//   // TODO:ME- All use cases will return same error message so we can use  anyone?
//   const { collection } = useCollection(collectionRepository, ':root')

interface SignUpProps {
  hasValidTokenButNotLinkedAccount: boolean
}

export const SignUp = ({ hasValidTokenButNotLinkedAccount }: SignUpProps) => {
  const { t } = useTranslation('signUp')
  const { setIsLoading } = useLoading()

  useEffect(() => setIsLoading(false), [setIsLoading])

  return (
    <section>
      <div className={styles['alert-container']}>
        {!hasValidTokenButNotLinkedAccount && (
          <Alert variant="info" customHeading={t('createAccount.heading')}>
            {t('createAccount.alertText')}
          </Alert>
        )}
        {hasValidTokenButNotLinkedAccount && (
          <Alert variant="info" customHeading={t('hasValidTokenButNotLinkedAccount.heading')}>
            <span className={styles['not-linked-account-text']}>
              {t('hasValidTokenButNotLinkedAccount.alertText')}
            </span>
          </Alert>
        )}
      </div>
      <header className={styles.header}>
        <h1>{t('pageTitle')}</h1>
      </header>

      <Tabs defaultActiveKey="accountInfo">
        <Tabs.Tab eventKey="accountInfo" title={t('accountInfo')}>
          <div className={styles['tab-container']}>
            <ValidTokenNotLinkedAccountForm />
          </div>
        </Tabs.Tab>
      </Tabs>
    </section>
  )
}
