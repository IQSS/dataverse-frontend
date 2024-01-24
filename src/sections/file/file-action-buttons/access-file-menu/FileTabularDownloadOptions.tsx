import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useDataset } from '../../../dataset/DatasetContext'
import { useTranslation } from 'react-i18next'
import { FileDownloadUrls, FileType } from '../../../../files/domain/models/FileMetadata'
import FileTypeToFriendlyTypeMap from '../../../../files/domain/models/FileTypeToFriendlyTypeMap'

interface FileTabularDownloadOptionsProps {
  type: FileType
  ingestInProgress: boolean
  downloadUrls: FileDownloadUrls
}

export function FileTabularDownloadOptions({
  type,
  ingestInProgress,
  downloadUrls
}: FileTabularDownloadOptionsProps) {
  const { t } = useTranslation('files')
  const { dataset } = useDataset()
  const downloadDisabled = ingestInProgress || (dataset && dataset.isLockedFromFileDownload)

  return (
    <>
      {!type.originalFormatIsUnknown && (
        <DropdownButtonItem href={downloadUrls.original} disabled={downloadDisabled}>{`${
          type.original || ''
        } (${t('actions.accessFileMenu.downloadOptions.options.original')})`}</DropdownButtonItem>
      )}
      <DropdownButtonItem href={downloadUrls.tabular} disabled={downloadDisabled}>
        {t('actions.accessFileMenu.downloadOptions.options.tabular')}
      </DropdownButtonItem>
      {type.original !== FileTypeToFriendlyTypeMap['application/x-r-data'] && (
        <DropdownButtonItem href={downloadUrls.rData} disabled={downloadDisabled}>
          {t('actions.accessFileMenu.downloadOptions.options.RData')}
        </DropdownButtonItem>
      )}
    </>
  )
}
