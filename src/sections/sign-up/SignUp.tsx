import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Tabs } from '@iqss/dataverse-design-system'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { useLoading } from '../loading/LoadingContext'
import { ValidTokenNotLinkedAccountForm } from './valid-token-not-linked-account-form/ValidTokenNotLinkedAccountForm'
import styles from './SignUp.module.scss'

// TODO:ME - All use cases will return same error message so this is blocking us for making requests to other public use cases like get root collection, should work removing access token from localstorage but we need it for future call
// TODO:ME - How to handle 401 Unauthorized {"status":"ERROR","message":"Unauthorized bearer token."} globally, maybe redirect to oidc login page?
// TODO:ME - Maybe we should redirect to a welcome page after success? ask if there is one, maybe not the case for this scenario
// TODO:ME - Ask about the format of the terms of use, html string? just text string? what is shown in the box if there is just a url string ?
// TODO:ME - Ask about logout when clicking the Cancel button because of the BEARER_TOKEN_IS_VALID_BUT_NOT_LINKED_MESSAGE error
// TODO:ME - JS-DATAVERSE use case for registration
// TODO:ME - JS-DATAVERSE use case for getting the terms of use? how to avoid sending token in this case?

/*
  This is the expected response from the server after succesfull registration, will help for js-dataverse-client-javascript
  const resp = {
    data: {
      status: 'OK',
      data: {
        message: 'User registered.'
      }
    },
    status: 200,
    statusText: 'OK'
  }
*/

interface SignUpProps {
  userRepository: UserRepository
  dataverseInfoRepository: DataverseInfoRepository
  hasValidTokenButNotLinkedAccount: boolean
}

export const SignUp = ({
  userRepository,
  dataverseInfoRepository,
  hasValidTokenButNotLinkedAccount
}: SignUpProps) => {
  const { t } = useTranslation('signUp')
  const { setIsLoading } = useLoading()

  useEffect(() => setIsLoading(false), [setIsLoading])

  return (
    <section>
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
              <ValidTokenNotLinkedAccountForm
                userRepository={userRepository}
                dataverseInfoRepository={dataverseInfoRepository}
              />
            )}
          </div>
        </Tabs.Tab>
      </Tabs>
    </section>
  )
}
