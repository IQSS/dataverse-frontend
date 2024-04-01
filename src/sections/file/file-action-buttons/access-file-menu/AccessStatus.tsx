import { Globe, LockFill, UnlockFill } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'
import styles from './AccessFileMenu.module.scss'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'

interface AccessStatusProps {
  userHasDownloadPermission: boolean
  isRestricted: boolean
  isActivelyEmbargoed: boolean
}

export function AccessStatus({
  userHasDownloadPermission,
  isRestricted,
  isActivelyEmbargoed
}: AccessStatusProps) {
  return (
    <DropdownButtonItem disabled>
      <span>
        <AccessStatusIcon
          userHasDownloadPermission={userHasDownloadPermission}
          isRestricted={isRestricted}
        />{' '}
        <AccessStatusText
          isRestricted={isRestricted}
          isActivelyEmbargoed={isActivelyEmbargoed}
          userHasDownloadPermission={userHasDownloadPermission}
        />
      </span>
    </DropdownButtonItem>
  )
}

function AccessStatusIcon({
  userHasDownloadPermission,
  isRestricted
}: {
  userHasDownloadPermission: boolean
  isRestricted: boolean
}) {
  const { t } = useTranslation('file')
  if (isRestricted) {
    if (userHasDownloadPermission) {
      return (
        <UnlockFill title={t('fileAccess.restrictedWithAccess.icon')} className={styles.success} />
      )
    }
    return <LockFill role="img" title={t('fileAccess.restricted.icon')} className={styles.danger} />
  }
  return <Globe role="img" title={t('fileAccess.public.icon')} className={styles.success} />
}

function AccessStatusText({
  isActivelyEmbargoed,
  isRestricted,
  userHasDownloadPermission
}: {
  isActivelyEmbargoed: boolean
  isRestricted: boolean
  userHasDownloadPermission: boolean
}) {
  const { t } = useTranslation('file')
  const getAccessStatus = () => {
    if (isActivelyEmbargoed) {
      return 'embargoed'
    }

    if (isRestricted) {
      if (!userHasDownloadPermission) {
        return 'restricted'
      }

      return 'restrictedWithAccess'
    }

    return 'public'
  }

  return (
    <span
      className={
        styles[getAccessStatus() === 'public' || userHasDownloadPermission ? 'success' : 'danger']
      }>
      {t(`fileAccess.${getAccessStatus()}.name`)}
    </span>
  )
}
