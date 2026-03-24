import { useTranslation } from 'react-i18next'
import { ButtonGroup } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { FilePreview } from '@/files/domain/models/FilePreview'
import { DatasetPublishingStatus } from '@/dataset/domain/models/Dataset'
import { AccessFileMenu } from '@/sections/file/file-action-buttons/access-file-menu/AccessFileMenu'
import { FileOptionsMenu } from './file-options-menu/FileOptionsMenu'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { FileTools } from './FileTools'

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
  const isBelow768px = useMediaQuery('(max-width: 768px)')

  return (
    <ButtonGroup aria-label={t('actions.buttons')} vertical={isBelow768px}>
      <FileTools file={file} canDownloadFile={file.permissions.canDownloadFile} />
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
