import { EditFilesMenu } from './edit-files-menu/EditFilesMenu'
import { File } from '../../../../../files/domain/models/File'
import styles from './FileActionsHeader.module.scss'
import { useTranslation } from 'react-i18next'
import { DownloadFilesButton } from './download-files/DownloadFilesButton'
interface FileActionsHeaderProps {
  files: File[]
}
export function FileActionsHeader({ files }: FileActionsHeaderProps) {
  const { t } = useTranslation('files')
  return (
    <div aria-label={t('actions.title')} className={styles.container}>
      <EditFilesMenu files={files} />
      <DownloadFilesButton files={files} />
    </div>
  )
}
