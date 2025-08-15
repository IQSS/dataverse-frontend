import { EditFilesMenu } from './edit-files-menu/EditFilesMenu'
import { FilePreview } from '../../../../../files/domain/models/FilePreview'
import styles from './FileActionsHeader.module.scss'
import { useTranslation } from 'react-i18next'
import { DownloadFilesButton } from './download-files/DownloadFilesButton'
import { FileSelection } from '../row-selection/useFileSelection'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'

interface FileActionsHeaderProps {
  files: FilePreview[]
  fileSelection: FileSelection
  fileRepository: FileRepository
  datasetRepository: DatasetRepository
}

export function FileActionsHeader({
  files,
  fileSelection,
  fileRepository,
  datasetRepository
}: FileActionsHeaderProps) {
  const { t } = useTranslation('files')
  return (
    <div aria-label={t('actions.title')} role="region" className={styles.container}>
      <EditFilesMenu
        files={files}
        fileSelection={fileSelection}
        fileRepository={fileRepository}
        datasetRepository={datasetRepository}
      />
      <DownloadFilesButton files={files} fileSelection={fileSelection} />
    </div>
  )
}
