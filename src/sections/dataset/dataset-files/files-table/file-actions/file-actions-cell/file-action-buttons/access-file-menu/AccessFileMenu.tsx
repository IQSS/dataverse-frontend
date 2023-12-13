import { FilePreview } from '../../../../../../../../files/domain/models/FilePreview'
import { Download, FileEarmark } from 'react-bootstrap-icons'
import { AccessStatus } from './AccessStatus'
import { RequestAccessOption } from './RequestAccessOption'
import { DropdownButton, DropdownHeader, Tooltip } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { FileDownloadOptions } from './FileDownloadOptions'

interface FileActionButtonAccessFileProps {
  file: FilePreview
}
export function AccessFileMenu({ file }: FileActionButtonAccessFileProps) {
  const { t } = useTranslation('files')
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
        <FileDownloadOptions file={file} />
      </DropdownButton>
    </Tooltip>
  )
}
