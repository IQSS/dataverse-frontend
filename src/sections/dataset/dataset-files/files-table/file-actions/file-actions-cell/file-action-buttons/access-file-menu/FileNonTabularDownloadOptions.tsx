import { File, FileIngestStatus } from '../../../../../../../../files/domain/models/File'
import FileTypeToFriendlyTypeMap from '../../../../../../../../files/domain/models/FileTypeToFriendlyTypeMap'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useDataset } from '../../../../../../DatasetContext'
import { useTranslation } from 'react-i18next'
import { useFileDownload } from '../../../../../../../file/file-download-helper/useFileDownload'

interface FileNonTabularDownloadOptionsProps {
  file: File
}

export function FileNonTabularDownloadOptions({ file }: FileNonTabularDownloadOptionsProps) {
  const { t } = useTranslation('files')
  const { dataset } = useDataset()
  const { originalFile } = useFileDownload(file.id)
  const originalFileFormatIsKnown =
    file.type.toDisplayFormat() !== FileTypeToFriendlyTypeMap.unknown

  if (file.tabularData) {
    return <></>
  }

  return (
    <DropdownButtonItem
      href={originalFile}
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
