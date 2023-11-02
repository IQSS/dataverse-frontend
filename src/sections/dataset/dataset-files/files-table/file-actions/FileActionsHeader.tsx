import { EditFilesMenu } from './edit-files-menu/EditFilesMenu'
import { File } from '../../../../../files/domain/models/File'
import styles from './FileActionsHeader.module.scss'
import { useTranslation } from 'react-i18next'
import { DownloadFilesButton } from './download-files/DownloadFilesButton'
import { FileSelection } from '../row-selection/useFileSelection'
interface FileActionsHeaderProps {
  files: File[]
  fileSelection: FileSelection
}
export function FileActionsHeader({ files, fileSelection }: FileActionsHeaderProps) {
  const { t } = useTranslation('files')
  return (
    <div aria-label={t('actions.title')} className={styles.container}>
      <EditFilesMenu files={files} fileSelection={fileSelection} />
      <DownloadFilesButton files={files} fileSelection={fileSelection} />
    </div>
  )
}
