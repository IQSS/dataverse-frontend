import styles from './DatasetsList.module.scss'
import { Trans, useTranslation } from 'react-i18next'
import { useSession } from '../../session/SessionContext'
import { Route } from '../../Route.enum'

export function NoDatasetsMessage() {
  const { t } = useTranslation('home')
  const { user } = useSession()

  return (
    <div className={styles['empty-message-container']}>
      {user ? (
        <p>{t('noDatasetsMessage.authenticated')}</p>
      ) : (
        <Trans i18nKey="noDatasetsMessage.anonymous">
          <p>
            This dataverse currently has no datasets. Please <a href={Route.LOG_IN}>log in</a> to
            see if you are able to add to it.
          </p>
        </Trans>
      )}
    </div>
  )
}
