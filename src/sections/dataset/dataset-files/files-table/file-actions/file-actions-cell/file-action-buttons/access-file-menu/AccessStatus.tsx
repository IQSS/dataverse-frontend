import { FilePreview } from '../../../../../../../../files/domain/models/FilePreview'
import { Globe, LockFill, UnlockFill } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'
import styles from './AccessFileMenu.module.scss'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useFileDownloadPermission } from '../../../../../../../file/file-permissions/useFileDownloadPermission'

interface AccessStatusProps {
  file: FilePreview
}

export function AccessStatus({ file }: AccessStatusProps) {
  const { sessionUserHasFileDownloadPermission } = useFileDownloadPermission(file)

  return (
    <DropdownButtonItem disabled>
      <span>
        <AccessStatusIcon
          sessionUserHasFileDownloadPermission={sessionUserHasFileDownloadPermission}
          restricted={file.access.restricted}
        />{' '}
        <AccessStatusText
          file={file}
          sessionUserHasFileDownloadPermission={sessionUserHasFileDownloadPermission}
        />
      </span>
    </DropdownButtonItem>
  )
}

function AccessStatusIcon({
  sessionUserHasFileDownloadPermission,
  restricted
}: {
  sessionUserHasFileDownloadPermission: boolean
  restricted: boolean
}) {
  const { t } = useTranslation('file')
  if (restricted) {
    if (sessionUserHasFileDownloadPermission) {
      return (
        <UnlockFill title={t('fileAccess.restrictedWithAccess.icon')} className={styles.success} />
      )
    }
    return <LockFill role="img" title={t('fileAccess.restricted.icon')} className={styles.danger} />
  }
  return <Globe role="img" title={t('fileAccess.public.icon')} className={styles.success} />
}

function AccessStatusText({
  file,
  sessionUserHasFileDownloadPermission
}: {
  file: FilePreview
  sessionUserHasFileDownloadPermission: boolean
}) {
  const { t } = useTranslation('file')
  const getAccessStatus = () => {
    if (file.isActivelyEmbargoed) {
      return 'embargoed'
    }

    if (file.access.restricted) {
      if (!sessionUserHasFileDownloadPermission) {
        return 'restricted'
      }

      return 'restrictedWithAccess'
    }

    return 'public'
  }

  return (
    <span
      className={
        styles[
          getAccessStatus() === 'public' || sessionUserHasFileDownloadPermission
            ? 'success'
            : 'danger'
        ]
      }>
      {t(`fileAccess.${getAccessStatus()}.name`)}
    </span>
  )
}
