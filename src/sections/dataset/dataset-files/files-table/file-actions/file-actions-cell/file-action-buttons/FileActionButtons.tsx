import { AccessFileMenu } from '../../../../../../file/file-action-buttons/access-file-menu/AccessFileMenu'
import { FilePreview } from '../../../../../../../files/domain/models/FilePreview'
import { FileOptionsMenu } from './file-options-menu/FileOptionsMenu'
import { ButtonGroup } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { DatasetPublishingStatus } from '../../../../../../../dataset/domain/models/Dataset'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'

interface FileActionButtonsProps {
  file: FilePreview
  fileRepository: FileRepository
  datasetRepository: DatasetRepository
}
export function FileActionButtons({
  file,
  fileRepository,
  datasetRepository
}: FileActionButtonsProps) {
  const { t } = useTranslation('files')

  return (
    <ButtonGroup aria-label={t('actions.buttons')}>
      <AccessFileMenu
        id={file.id}
        access={file.access}
        userHasDownloadPermission={file.permissions.canDownloadFile}
        metadata={file.metadata}
        isDeaccessioned={file.datasetPublishingStatus === DatasetPublishingStatus.DEACCESSIONED}
        ingestInProgress={file.ingest.isInProgress}
        asIcon
      />
      <FileOptionsMenu
        file={file}
        fileRepository={fileRepository}
        datasetRepository={datasetRepository}
      />
    </ButtonGroup>
  )
}
