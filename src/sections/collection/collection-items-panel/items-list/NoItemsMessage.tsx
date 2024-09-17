import { Trans, useTranslation } from 'react-i18next'
import { useSession } from '../../../session/SessionContext'
import { Route } from '../../../Route.enum'
import styles from './ItemsList.module.scss'

export function NoItemsMessage() {
  const { t } = useTranslation('collection')
  const { user } = useSession()

  return (
    <div className={styles['custom-message-container']}>
      {user ? (
        <p>{t('noItemsMessage.authenticated')}</p>
      ) : (
        <Trans i18nKey="noItemsMessage.anonymous">
          <p>
            This collection currently has no collections, datasets or files. Please{' '}
            <a href={Route.LOG_IN}>log in</a> to see if you are able to add to it.
          </p>
        </Trans>
      )}
    </div>
  )
}
