import { AccessFileMenu } from '../../../../../../file/file-action-buttons/access-file-menu/AccessFileMenu'
import { FilePreview } from '../../../../../../../files/domain/models/FilePreview'
import { FileOptionsMenu } from './file-options-menu/FileOptionsMenu'
import { ButtonGroup } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { DatasetPublishingStatus } from '../../../../../../../dataset/domain/models/Dataset'
import { FileRepository } from '@/files/domain/repositories/FileRepository'

interface FileActionButtonsProps {
  file: FilePreview
  fileRepository: FileRepository
}
export function FileActionButtons({ file, fileRepository }: FileActionButtonsProps) {
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
        isDraft={file.datasetPublishingStatus === DatasetPublishingStatus.DRAFT}
      />
      <FileOptionsMenu file={file} fileRepository={fileRepository} />
    </ButtonGroup>
  )
}
