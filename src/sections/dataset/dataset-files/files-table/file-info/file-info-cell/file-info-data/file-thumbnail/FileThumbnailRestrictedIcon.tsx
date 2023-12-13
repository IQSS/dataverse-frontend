import { LockFill, UnlockFill } from 'react-bootstrap-icons'
import styles from './FileThumbnail.module.scss'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@iqss/dataverse-design-system'
import { FilePreview } from '../../../../../../../../files/domain/models/FilePreview'
import { useFileDownloadPermission } from '../../../../../../../file/file-permissions/useFileDownloadPermission'

export function FileThumbnailRestrictedIcon({ file }: { file: FilePreview }) {
  if (!file.access.restricted) {
    return <></>
  }

  const { t } = useTranslation('files')
  const { sessionUserHasFileDownloadPermission } = useFileDownloadPermission(file)
  return (
    <span
      className={
        styles[
          `restricted-icon-${
            sessionUserHasFileDownloadPermission ? 'restrictedWithAccess' : 'restricted'
          }`
        ]
      }>
      <Tooltip
        overlay={`${t('table.fileAccess.title')}: ${t(
          `table.fileAccess.${
            sessionUserHasFileDownloadPermission ? 'restrictedWithAccess' : 'restricted'
          }.name`
        )}`}
        placement="top">
        {sessionUserHasFileDownloadPermission ? (
          <UnlockFill role="img" title={t('table.fileAccess.restrictedWithAccess.icon')} />
        ) : (
          <LockFill role="img" title={t('table.fileAccess.restricted.icon')} />
        )}
      </Tooltip>
    </span>
  )
}
