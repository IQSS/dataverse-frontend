import { Download, FileEarmark } from 'react-bootstrap-icons'
import { AccessStatus } from './AccessStatus'
import { RequestAccessOption } from './RequestAccessOption'
import { DropdownButton, DropdownHeader, Tooltip } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { FileDownloadOptions } from './FileDownloadOptions'
import { FileAccess } from '../../../../files/domain/models/FileAccess'
import { FileMetadata } from '../../../../files/domain/models/FileMetadata'
import { ReactElement } from 'react'

interface FileActionButtonAccessFileProps {
  id: number
  access: FileAccess
  userHasDownloadPermission: boolean
  metadata: FileMetadata
  ingestInProgress: boolean
  isDeaccessioned: boolean
  asIcon?: boolean
}

export function AccessFileMenu({
  id,
  access,
  userHasDownloadPermission,
  metadata,
  ingestInProgress,
  isDeaccessioned,
  asIcon = false
}: FileActionButtonAccessFileProps) {
  const { t } = useTranslation('files')
  function MenuWrapper({ children }: { children: ReactElement }) {
    if (asIcon) {
      return (
        <Tooltip placement="top" overlay={t('actions.accessFileMenu.title')}>
          {children}
        </Tooltip>
      )
    }
    return children
  }

  // Temporary fix to avoid showing the access file menu for non-S3 files
  // TODO: remove this when we can handle non-S3 files
  if (metadata.storageIdentifier && !metadata.storageIdentifier?.startsWith('s3')) {
    return <></>
  }

  return (
    <MenuWrapper>
      <DropdownButton
        id={`action-button-access-file-${id}`}
        title={asIcon ? '' : t('actions.accessFileMenu.title')}
        asButtonGroup
        variant={asIcon ? 'secondary' : 'primary'}
        icon={asIcon ? <Download aria-label={t('actions.accessFileMenu.title')} /> : undefined}>
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
    </MenuWrapper>
  )
}
