import { File, FileIngestStatus } from '../../../../../../../../files/domain/models/File'
import FileTypeToFriendlyTypeMap from '../../../../../../../../files/domain/models/FileTypeToFriendlyTypeMap'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useDataset } from '../../../../../../DatasetContext'
import { useTranslation } from 'react-i18next'

interface FileNonTabularDownloadOptionsProps {
  file: File
}

export function FileNonTabularDownloadOptions({ file }: FileNonTabularDownloadOptionsProps) {
  const { t } = useTranslation('files')
  const { dataset } = useDataset()
  const originalFileFormatIsKnown =
    file.type.toDisplayFormat() !== FileTypeToFriendlyTypeMap.unknown

  if (file.tabularData) {
    return <></>
  }

  return (
    <DropdownButtonItem
      href={file.originalFileDownloadUrl}
      download={file.name}
      disabled={
        file.ingest.status === FileIngestStatus.IN_PROGRESS ||
        (dataset && dataset.isLockedFromFileDownload)
      }>
      {originalFileFormatIsKnown
        ? file.type.toDisplayFormat()
        : t('actions.accessFileMenu.downloadOptions.options.original')}
    </DropdownButtonItem>
  )
}
