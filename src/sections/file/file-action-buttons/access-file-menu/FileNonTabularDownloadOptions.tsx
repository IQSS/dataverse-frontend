import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useDataset } from '../../../dataset/DatasetContext'
import { useTranslation } from 'react-i18next'
import { FileType } from '../../../../files/domain/models/FileMetadata'

interface FileNonTabularDownloadOptionsProps {
  type: FileType
  downloadUrlOriginal: string
  ingestIsInProgress: boolean
}

export function FileNonTabularDownloadOptions({
  type,
  downloadUrlOriginal,
  ingestIsInProgress
}: FileNonTabularDownloadOptionsProps) {
  const { t } = useTranslation('files')
  const { dataset } = useDataset()

  return (
    <DropdownButtonItem
      href={downloadUrlOriginal}
      disabled={ingestIsInProgress || (dataset && dataset.isLockedFromFileDownload)}>
      {type.displayFormatIsUnknown
        ? t('actions.accessFileMenu.downloadOptions.options.original')
        : type.toDisplayFormat()}
    </DropdownButtonItem>
  )
}
