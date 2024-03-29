import { FileDownloadMode } from '../../../../../../files/domain/models/FileMetadata'
import { useDataset } from '../../../../DatasetContext'
import { Button, DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { Download } from 'react-bootstrap-icons'
import styles from './DownloadFilesButton.module.scss'
import { useTranslation } from 'react-i18next'
import { FileSelection } from '../../row-selection/useFileSelection'
import { NoSelectedFilesModal } from '../no-selected-files-modal/NoSelectedFilesModal'
import { MouseEvent, useState } from 'react'
import { useMultipleFileDownload } from '../../../../../file/multiple-file-download/MultipleFileDownloadContext'
import { FilePreview } from '../../../../../../files/domain/models/FilePreview'

interface DownloadFilesButtonProps {
  files: FilePreview[]
  fileSelection: FileSelection
}

const MINIMUM_FILES_COUNT_TO_SHOW_DOWNLOAD_FILES_BUTTON = 1
const SELECTED_FILES_EMPTY = 0

export function DownloadFilesButton({ files, fileSelection }: DownloadFilesButtonProps) {
  const { t } = useTranslation('files')
  const { dataset } = useDataset()
  const [showNoFilesSelectedModal, setShowNoFilesSelectedModal] = useState(false)
  const { getMultipleFileDownloadUrl } = useMultipleFileDownload()
  const fileSelectionCount = Object.keys(fileSelection).length
  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (fileSelectionCount === SELECTED_FILES_EMPTY) {
      event.preventDefault()
      setShowNoFilesSelectedModal(true)
    }
  }
  const getDownloadUrl = (downloadMode: FileDownloadMode): string => {
    const allFilesSelected = Object.values(fileSelection).some((file) => file === undefined)
    if (allFilesSelected) {
      return dataset ? dataset.downloadUrls[downloadMode] : ''
    }

    return getMultipleFileDownloadUrl(getFileIdsFromSelection(fileSelection), downloadMode)
  }

  if (
    files.length < MINIMUM_FILES_COUNT_TO_SHOW_DOWNLOAD_FILES_BUTTON ||
    !dataset?.permissions.canDownloadFiles
  ) {
    return <></>
  }

  if (dataset.hasOneTabularFileAtLeast) {
    return (
      <>
        <DropdownButton
          id="download-files"
          icon={<Download className={styles.icon} />}
          title={t('actions.downloadFiles.title')}
          variant="secondary"
          withSpacing>
          <DropdownButtonItem onClick={onClick} href={getDownloadUrl(FileDownloadMode.ORIGINAL)}>
            {t('actions.downloadFiles.options.original')}
          </DropdownButtonItem>
          <DropdownButtonItem onClick={onClick} href={getDownloadUrl(FileDownloadMode.ARCHIVAL)}>
            {t('actions.downloadFiles.options.archival')}
          </DropdownButtonItem>
        </DropdownButton>
        <NoSelectedFilesModal
          show={showNoFilesSelectedModal}
          handleClose={() => setShowNoFilesSelectedModal(false)}
        />
      </>
    )
  }

  return (
    <>
      <a href={getDownloadUrl(FileDownloadMode.ORIGINAL)}>
        <Button
          variant="secondary"
          icon={<Download className={styles.icon} />}
          withSpacing
          onClick={onClick}>
          {t('actions.downloadFiles.title')}
        </Button>
      </a>
      <NoSelectedFilesModal
        show={showNoFilesSelectedModal}
        handleClose={() => setShowNoFilesSelectedModal(false)}
      />
    </>
  )
}

const getFileIdsFromSelection = (fileSelection: FileSelection): number[] => {
  return Object.values(fileSelection)
    .filter((file): file is FilePreview => file !== undefined)
    .map((file) => file.id)
}
