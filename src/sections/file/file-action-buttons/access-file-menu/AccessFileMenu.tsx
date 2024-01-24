import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { Download, FileEarmark } from 'react-bootstrap-icons'
import { AccessStatus } from './AccessStatus'
import { RequestAccessOption } from './RequestAccessOption'
import { DropdownButton, DropdownHeader, Tooltip } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { FileDownloadOptions } from './FileDownloadOptions'
import { useFileDownloadPermission } from '../../file-permissions/useFileDownloadPermission'

interface FileActionButtonAccessFileProps {
  file: FilePreview
}

export function AccessFileMenu({ file }: FileActionButtonAccessFileProps) {
  const { t } = useTranslation('files')
  const { sessionUserHasFileDownloadPermission } = useFileDownloadPermission(file)

  return (
    <Tooltip placement="top" overlay={t('actions.accessFileMenu.title')}>
      <DropdownButton
        id={`action-button-access-file-${file.id}`}
        title=""
        asButtonGroup
        variant="secondary"
        icon={<Download aria-label={t('actions.accessFileMenu.title')} />}>
        <DropdownHeader>
          {t('actions.accessFileMenu.headers.fileAccess')} <FileEarmark />
        </DropdownHeader>
        <AccessStatus file={file} />
        <RequestAccessOption file={file} />
        <FileDownloadOptions
          type={file.metadata.type}
          downloadUrls={file.metadata.downloadUrls}
          ingestInProgress={file.ingest.isInProgress}
          isTabular={file.metadata.isTabular}
          userHasDownloadPermission={sessionUserHasFileDownloadPermission}
        />
      </DropdownButton>
    </Tooltip>
  )
}
