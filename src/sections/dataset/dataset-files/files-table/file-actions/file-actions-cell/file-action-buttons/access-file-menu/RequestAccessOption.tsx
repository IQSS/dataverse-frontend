import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import styles from './AccessFileMenu.module.scss'
import { RequestAccessModal } from './RequestAccessModal'
import { File, FilePublishingStatus } from '../../../../../../../../files/domain/models/File'
import { useTranslation } from 'react-i18next'
import { useFileDownloadPermission } from '../../../../../../../file/file-permissions/useFileDownloadPermission'

interface RequestAccessButtonProps {
  file: File
}
export function RequestAccessOption({ file }: RequestAccessButtonProps) {
  const { t } = useTranslation('files')
  const { sessionUserHasFileDownloadPermission } = useFileDownloadPermission(file)

  if (
    file.version.publishingStatus === FilePublishingStatus.DEACCESSIONED ||
    sessionUserHasFileDownloadPermission
  ) {
    return <></>
  }
  if (file.isActivelyEmbargoed) {
    if (file.access.restricted) {
      return (
        <DropdownButtonItem disabled>
          {t('requestAccess.embargoedThenRestricted')}.
        </DropdownButtonItem>
      )
    }
    return <DropdownButtonItem disabled>{t('requestAccess.embargoed')}.</DropdownButtonItem>
  }
  if (!file.access.canBeRequested) {
    return <DropdownButtonItem disabled>{t('requestAccess.requestNotAllowed')}.</DropdownButtonItem>
  }
  if (file.access.requested) {
    return (
      <DropdownButtonItem disabled className={styles['access-requested-message']}>
        {t('requestAccess.accessRequested')}
      </DropdownButtonItem>
    )
  }
  return <RequestAccessModal fileId={file.id} />
}
