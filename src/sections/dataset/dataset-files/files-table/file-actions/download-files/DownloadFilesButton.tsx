import { File } from '../../../../../../files/domain/models/File'
import { useDataset } from '../../../../DatasetContext'
import { Button, DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'

interface DownloadFilesButtonProps {
  files: File[]
}

const MINIMUM_FILES_COUNT_TO_SHOW_DOWNLOAD_FILES_BUTTON = 1
export function DownloadFilesButton({ files }: DownloadFilesButtonProps) {
  const { dataset } = useDataset()

  if (
    files.length < MINIMUM_FILES_COUNT_TO_SHOW_DOWNLOAD_FILES_BUTTON ||
    !dataset?.permissions.canDownloadFiles
  ) {
    return <></>
  }

  if (files.some((file) => file.isTabularData)) {
    return (
      <DropdownButton id="download-files" title="Download" variant="secondary">
        <DropdownButtonItem>Original Format</DropdownButtonItem>
        <DropdownButtonItem>Archival Format (.tab)</DropdownButtonItem>
      </DropdownButton>
    )
  }

  return <Button variant="secondary">Download</Button>
}

// Original:
// < div
// jsf:id = "downloadButtonBlockNormal"
// className = "btn-group"
// jsf:rendered = "#{(!(empty DatasetPage.workingVersion.fileMetadatas)
// and
// DatasetPage.workingVersion.fileMetadatas.size() > 1
// )
// and
// DatasetPage.downloadButtonAvailable
// and !
// DatasetPage.isVersionHasTabular()
// }
// ">
// < p
// :
// commandLink
// styleClass = "btn btn-default btn-download"
// disabled = "#{false and DatasetPage.lockedFromDownload}"
// onclick = "if (!testFilesSelected()) return false;"
// action = "#{DatasetPage.startDownloadSelectedOriginal()}"
// update = "@form"
// oncomplete = "showPopup();" >
//   < f
// :
// setPropertyActionListener
// target = "#{DatasetPage.fileMetadataForAction}"
// value = "#{null}" / >
//   < span
// className = "glyphicon glyphicon-download-alt" / > #{bundle.download}
//   < /p:commandLink>
// </div>
