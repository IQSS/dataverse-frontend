import { EditFilesMenu } from './edit-files-menu/EditFilesMenu'
import { FilePreview } from '../../../../../files/domain/models/FilePreview'
import styles from './FileActionsHeader.module.scss'
import { useTranslation } from 'react-i18next'
import { DownloadFilesButton } from './download-files/DownloadFilesButton'
import { FileSelection } from '../row-selection/useFileSelection'
import { FileRepository } from '@/files/domain/repositories/FileRepository'

interface FileActionsHeaderProps {
  files: FilePreview[]
  fileSelection: FileSelection
  fileRepository: FileRepository
}

export function FileActionsHeader({
  files,
  fileSelection,
  fileRepository
}: FileActionsHeaderProps) {
  const { t } = useTranslation('files')
  return (
    <div aria-label={t('actions.title')} role="region" className={styles.container}>
      <EditFilesMenu files={files} fileSelection={fileSelection} fileRepository={fileRepository} />
      <DownloadFilesButton files={files} fileSelection={fileSelection} />
    </div>
  )
}
