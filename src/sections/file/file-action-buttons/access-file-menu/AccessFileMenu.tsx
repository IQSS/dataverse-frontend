import { Download, FileEarmark } from 'react-bootstrap-icons'
import { AccessStatus } from './AccessStatus'
import { RequestAccessOption } from './RequestAccessOption'
import { DropdownButton, DropdownHeader, Tooltip } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { FileDownloadOptions } from './FileDownloadOptions'
import { FileAccess } from '../../../../files/domain/models/FileAccess'
import { FileMetadata } from '../../../../files/domain/models/FileMetadata'

interface FileActionButtonAccessFileProps {
  id: number
  access: FileAccess
  userHasDownloadPermission: boolean
  metadata: FileMetadata
  ingestInProgress: boolean
  isDeaccessioned: boolean
}

export function AccessFileMenu({
  id,
  access,
  userHasDownloadPermission,
  metadata,
  ingestInProgress,
  isDeaccessioned
}: FileActionButtonAccessFileProps) {
  const { t } = useTranslation('files')

  return (
    <Tooltip placement="top" overlay={t('actions.accessFileMenu.title')}>
      <DropdownButton
        id={`action-button-access-file-${id}`}
        title=""
        asButtonGroup
        variant="secondary"
        icon={<Download aria-label={t('actions.accessFileMenu.title')} />}>
        <DropdownHeader>
          {t('actions.accessFileMenu.headers.fileAccess')} <FileEarmark />
        </DropdownHeader>
        <AccessStatus
          isRestricted={access.restricted}
          isActivelyEmbargoed={metadata.isActivelyEmbargoed}
          userHasDownloadPermission={userHasDownloadPermission}
        />
        <RequestAccessOption
          id={id}
          access={access}
          userHasDownloadPermission={userHasDownloadPermission}
          isDeaccessioned={isDeaccessioned}
          isActivelyEmbargoed={metadata.isActivelyEmbargoed}
        />
        <FileDownloadOptions
          type={metadata.type}
          downloadUrls={metadata.downloadUrls}
          ingestInProgress={ingestInProgress}
          isTabular={metadata.isTabular}
          userHasDownloadPermission={userHasDownloadPermission}
        />
      </DropdownButton>
    </Tooltip>
  )
}
