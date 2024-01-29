import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import styles from './AccessFileMenu.module.scss'
import { RequestAccessModal } from './RequestAccessModal'
import { useTranslation } from 'react-i18next'
import { FileAccess } from '../../../../files/domain/models/FileAccess'

interface RequestAccessButtonProps {
  id: number
  userHasDownloadPermission: boolean
  access: FileAccess
  isActivelyEmbargoed: boolean
  isDeaccessioned: boolean
}

export function RequestAccessOption({
  id,
  access,
  userHasDownloadPermission,
  isActivelyEmbargoed,
  isDeaccessioned
}: RequestAccessButtonProps) {
  const { t } = useTranslation('files')

  if (isDeaccessioned || userHasDownloadPermission) {
    return <></>
  }
  if (isActivelyEmbargoed) {
    if (access.restricted) {
      return (
        <DropdownButtonItem disabled>
          {t('requestAccess.embargoedThenRestricted')}.
        </DropdownButtonItem>
      )
    }
    return <DropdownButtonItem disabled>{t('requestAccess.embargoed')}.</DropdownButtonItem>
  }
  if (!access.canBeRequested) {
    return <DropdownButtonItem disabled>{t('requestAccess.requestNotAllowed')}.</DropdownButtonItem>
  }
  if (access.requested) {
    return (
      <DropdownButtonItem disabled className={styles['access-requested-message']}>
        {t('requestAccess.accessRequested')}
      </DropdownButtonItem>
    )
  }
  return <RequestAccessModal fileId={id} />
}
