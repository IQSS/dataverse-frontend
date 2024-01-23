import { FilePreview } from '../../../../../../../../files/domain/models/FilePreview'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useDataset } from '../../../../../../DatasetContext'
import { useTranslation } from 'react-i18next'
import { FileIngestStatus } from '../../../../../../../../files/domain/models/FileIngest'

interface FileTabularDownloadOptionsProps {
  file: FilePreview
}

export function FileTabularDownloadOptions({ file }: FileTabularDownloadOptionsProps) {
  const { t } = useTranslation('files')
  const { dataset } = useDataset()
  const downloadDisabled =
    file.ingest.status === FileIngestStatus.IN_PROGRESS ||
    (dataset && dataset.isLockedFromFileDownload)

  if (!file.metadata.tabularData) {
    return <></>
  }

  return (
    <>
      {file.metadata.type.original && file.metadata.type.original !== 'Unknown' && (
        <DropdownButtonItem
          href={file.metadata.downloadUrls.original}
          disabled={downloadDisabled}>{`${file.metadata.type.original} (${t(
          'actions.accessFileMenu.downloadOptions.options.original'
        )})`}</DropdownButtonItem>
      )}
      <DropdownButtonItem href={file.metadata.downloadUrls.tabular} disabled={downloadDisabled}>
        {t('actions.accessFileMenu.downloadOptions.options.tabular')}
      </DropdownButtonItem>
      {file.metadata.type.original !== 'R Data' && (
        <DropdownButtonItem href={file.metadata.downloadUrls.rData} disabled={downloadDisabled}>
          {t('actions.accessFileMenu.downloadOptions.options.RData')}
        </DropdownButtonItem>
      )}
    </>
  )
}
