import { Download } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'
import { Button, DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { MouseEvent, useState } from 'react'
import { FileDownloadMode } from '../../../../../../files/domain/models/FileMetadata'
import { useDataset } from '../../../../DatasetContext'
import { FileSelection } from '../../row-selection/useFileSelection'
import { NoSelectedFilesModal } from '../no-selected-files-modal/NoSelectedFilesModal'
import { useMultipleFileDownload } from '../../../../../file/multiple-file-download/MultipleFileDownloadContext'
import { FilePreview } from '../../../../../../files/domain/models/FilePreview'
import { useMediaQuery } from '../../../../../../shared/hooks/useMediaQuery'
import { DatasetPublishingStatus } from '@/dataset/domain/models/Dataset'
import { DownloadWithGuestbookModal } from '../file-actions-cell/file-action-buttons/file-options-menu/DownloadWithGuestbookModal'
import styles from './DownloadFilesButton.module.scss'

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
  const [showDownloadWithGuestbookModal, setShowDownloadWithGuestbookModal] = useState(false)
  const { getMultipleFileDownloadUrl } = useMultipleFileDownload()
  const isBelow768px = useMediaQuery('(max-width: 768px)')

  const fileSelectionCount = Object.keys(fileSelection).length
  const allFilesSelected = Object.values(fileSelection).some((file) => file === undefined)
  const allSelectedFileIds = files.map((file) => file.id)
  const fileIdsForGuestbookSubmission = allFilesSelected
    ? allSelectedFileIds
    : getFileIdsFromSelection(fileSelection)
  const hasGuestbook = dataset?.guestbookId !== undefined

  const onClick = (event: MouseEvent<HTMLElement>) => {
    if (fileSelectionCount === SELECTED_FILES_EMPTY) {
      event.preventDefault()
      setShowNoFilesSelectedModal(true)
      return
    }

    if (hasGuestbook) {
      event.preventDefault()
      setShowDownloadWithGuestbookModal(true)
    }
  }

  const getDownloadUrl = (downloadMode: FileDownloadMode): string => {
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

  // TODO: remove this when we can handle non-S3 files
  if (!dataset?.fileStore?.startsWith('s3')) {
    return <></>
  }

  // TODO: remove this when access datafile supports bearer tokens
  if (dataset.version.publishingStatus === DatasetPublishingStatus.DRAFT) {
    return <></>
  }

  const dropdownButtonTitle = isBelow768px
    ? ''
    : /* istanbul ignore next */ t('actions.downloadFiles.title')

  const downloadFeedbackModals = (
    <>
      <NoSelectedFilesModal
        show={showNoFilesSelectedModal}
        handleClose={() => setShowNoFilesSelectedModal(false)}
      />
      {hasGuestbook && (
        <DownloadWithGuestbookModal
          fileIds={fileIdsForGuestbookSubmission}
          guestbookId={dataset.guestbookId}
          show={showDownloadWithGuestbookModal}
          handleClose={() => setShowDownloadWithGuestbookModal(false)}
        />
      )}
    </>
  )

  if (dataset.hasOneTabularFileAtLeast) {
    return (
      <>
        <DropdownButton
          id="download-files"
          icon={<Download className={styles.icon} />}
          title={dropdownButtonTitle}
          ariaLabel={t('actions.downloadFiles.title')}
          variant="secondary"
          withSpacing>
          <DropdownButtonItem
            onClick={onClick}
            href={hasGuestbook ? undefined : getDownloadUrl(FileDownloadMode.ORIGINAL)}>
            {t('actions.downloadFiles.options.original')}
          </DropdownButtonItem>
          <DropdownButtonItem
            onClick={onClick}
            href={hasGuestbook ? undefined : getDownloadUrl(FileDownloadMode.ARCHIVAL)}>
            {t('actions.downloadFiles.options.archival')}
          </DropdownButtonItem>
        </DropdownButton>
        {downloadFeedbackModals}
      </>
    )
  }

  // no tabular file content
  return (
    <>
      {hasGuestbook ? (
        <Button
          id="download-files"
          variant="secondary"
          icon={<Download className={styles.icon} />}
          aria-label={t('actions.downloadFiles.title')}
          withSpacing
          onClick={onClick}>
          {dropdownButtonTitle}
        </Button>
      ) : (
        <a href={getDownloadUrl(FileDownloadMode.ORIGINAL)}>
          <Button
            id="download-files"
            variant="secondary"
            icon={<Download className={styles.icon} />}
            aria-label={t('actions.downloadFiles.title')}
            withSpacing
            onClick={onClick}>
            {dropdownButtonTitle}
          </Button>
        </a>
      )}

      {downloadFeedbackModals}
    </>
  )
}

const getFileIdsFromSelection = (fileSelection: FileSelection): number[] => {
  return Object.values(fileSelection)
    .filter((file): file is FilePreview => file !== undefined)
    .map((file) => file.id)
}
