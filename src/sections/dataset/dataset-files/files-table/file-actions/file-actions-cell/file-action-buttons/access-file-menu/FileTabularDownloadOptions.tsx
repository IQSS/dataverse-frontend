import { File, FileIngestStatus } from '../../../../../../../../files/domain/models/File'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useDataset } from '../../../../../../DatasetContext'

interface FileTabularDownloadOptionsProps {
  file: File
}

export function FileTabularDownloadOptions({ file }: FileTabularDownloadOptionsProps) {
  const { dataset } = useDataset()
  const originalFileFormatIsKnown = file.type.original && file.type.original !== 'Unknown'

  if (!file.tabularData) {
    return <></>
  }

  return (
    <>
      {originalFileFormatIsKnown && (
        <DropdownButtonItem
          disabled={
            file.ingest.status === FileIngestStatus.IN_PROGRESS ||
            (dataset && dataset.isLockedFromFileDownload)
          }>{`${file.type.original} (Original File Format)`}</DropdownButtonItem>
      )}
      <DropdownButtonItem
        disabled={
          file.ingest.status === FileIngestStatus.IN_PROGRESS ||
          (dataset && dataset.isLockedFromFileDownload)
        }>
        {file.type.toDisplayFormat()}
      </DropdownButtonItem>
      {file.type.original !== 'R Data' && (
        <DropdownButtonItem
          disabled={
            file.ingest.status === FileIngestStatus.IN_PROGRESS ||
            (dataset && dataset.isLockedFromFileDownload)
          }>
          R Data
        </DropdownButtonItem>
      )}
    </>
  )
}
