import { AccessFileMenu } from '../../../../../../file/file-action-buttons/access-file-menu/AccessFileMenu'
import { FilePreview } from '../../../../../../../files/domain/models/FilePreview'
import { FileOptionsMenu } from './file-options-menu/FileOptionsMenu'
import { ButtonGroup } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { FilePublishingStatus } from '../../../../../../../files/domain/models/FileVersion'

interface FileActionButtonsProps {
  file: FilePreview
}
export function FileActionButtons({ file }: FileActionButtonsProps) {
  const { t } = useTranslation('files')

  return (
    <ButtonGroup aria-label={t('actions.buttons')}>
      <AccessFileMenu
        id={file.id}
        access={file.access}
        userHasDownloadPermission={file.permissions.canDownloadFile}
        metadata={file.metadata}
        isDeaccessioned={file.version.publishingStatus === FilePublishingStatus.DEACCESSIONED}
        ingestInProgress={file.ingest.isInProgress}
        asIcon
      />
      <FileOptionsMenu file={file} />
    </ButtonGroup>
  )
}
