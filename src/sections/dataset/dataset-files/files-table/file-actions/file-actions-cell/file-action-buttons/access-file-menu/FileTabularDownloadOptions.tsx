import { File, FileIngestStatus } from '../../../../../../../../files/domain/models/File'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useDataset } from '../../../../../../DatasetContext'
import { useTranslation } from 'react-i18next'

interface FileTabularDownloadOptionsProps {
  file: File
}

export function FileTabularDownloadOptions({ file }: FileTabularDownloadOptionsProps) {
  const { t } = useTranslation('files')
  const { dataset } = useDataset()
  const originalFileFormatIsKnown = file.type.original && file.type.original !== 'Unknown'
  const downloadDisabled =
    file.ingest.status === FileIngestStatus.IN_PROGRESS ||
    (dataset && dataset.isLockedFromFileDownload)

  if (!file.tabularData) {
    return <></>
  }

  return (
    <>
      {originalFileFormatIsKnown && (
        <DropdownButtonItem href={file.downloadUrls.original} disabled={downloadDisabled}>{`${
          file.type.original
        } (${t('actions.accessFileMenu.downloadOptions.options.original')})`}</DropdownButtonItem>
      )}
      <DropdownButtonItem href={file.downloadUrls.tabular} disabled={downloadDisabled}>
        {t('actions.accessFileMenu.downloadOptions.options.tabular')}
      </DropdownButtonItem>
      {file.type.original !== 'R Data' && (
        <DropdownButtonItem href={file.downloadUrls.rData} disabled={downloadDisabled}>
          {t('actions.accessFileMenu.downloadOptions.options.RData')}
        </DropdownButtonItem>
      )}
    </>
  )
}
