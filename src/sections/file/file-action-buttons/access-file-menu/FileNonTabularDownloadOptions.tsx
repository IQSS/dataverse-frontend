import { FilePreview } from '../../../../files/domain/models/FilePreview'
import FileTypeToFriendlyTypeMap from '../../../../files/domain/models/FileTypeToFriendlyTypeMap'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useDataset } from '../../../dataset/DatasetContext'
import { useTranslation } from 'react-i18next'
import { FileIngestStatus } from '../../../../files/domain/models/FileIngest'

interface FileNonTabularDownloadOptionsProps {
  file: FilePreview
}

export function FileNonTabularDownloadOptions({ file }: FileNonTabularDownloadOptionsProps) {
  const { t } = useTranslation('files')
  const { dataset } = useDataset()
  const originalFileFormatIsKnown =
    file.metadata.type.toDisplayFormat() !== FileTypeToFriendlyTypeMap.unknown

  if (file.metadata.tabularData) {
    return <></>
  }

  return (
    <DropdownButtonItem
      href={file.metadata.downloadUrls.original}
      disabled={
        file.ingest.status === FileIngestStatus.IN_PROGRESS ||
        (dataset && dataset.isLockedFromFileDownload)
      }>
      {originalFileFormatIsKnown
        ? file.metadata.type.toDisplayFormat()
        : t('actions.accessFileMenu.downloadOptions.options.original')}
    </DropdownButtonItem>
  )
}
