import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { Download, FileEarmark } from 'react-bootstrap-icons'
import { AccessStatus } from './AccessStatus'
import { RequestAccessOption } from './RequestAccessOption'
import { DropdownButton, DropdownHeader, Tooltip } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { FileDownloadOptions } from './FileDownloadOptions'
import { useFileDownloadPermission } from '../../file-permissions/useFileDownloadPermission'
import { FilePublishingStatus } from '../../../../files/domain/models/FileVersion'

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
        <AccessStatus
          isRestricted={file.access.restricted}
          isActivelyEmbargoed={file.metadata.isActivelyEmbargoed}
          userHasDownloadPermission={sessionUserHasFileDownloadPermission}
        />
        <RequestAccessOption
          id={file.id}
          access={file.access}
          userHasDownloadPermission={sessionUserHasFileDownloadPermission}
          isDeaccessioned={file.version.publishingStatus === FilePublishingStatus.DEACCESSIONED}
          isActivelyEmbargoed={file.metadata.isActivelyEmbargoed}
        />
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
