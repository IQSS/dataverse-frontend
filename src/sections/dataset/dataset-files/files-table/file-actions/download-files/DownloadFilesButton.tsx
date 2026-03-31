import { Download } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'
import { Button, DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { MouseEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { FileDownloadMode } from '../../../../../../files/domain/models/FileMetadata'
import { useDataset } from '../../../../DatasetContext'
import { FileSelection } from '../../row-selection/useFileSelection'
import { NoSelectedFilesModal } from '../no-selected-files-modal/NoSelectedFilesModal'
import { FilePreview } from '../../../../../../files/domain/models/FilePreview'
import { useMediaQuery } from '../../../../../../shared/hooks/useMediaQuery'
import { DownloadWithGuestbookModal } from '../file-actions-cell/file-action-buttons/file-options-menu/DownloadWithGuestbookModal'
import {
  downloadFromSignedUrl,
  EMPTY_GUESTBOOK_RESPONSE,
  requestSignedDownloadUrlFromAccessApi
} from '@/shared/helpers/DownloadHelper'
import { useAccessRepository } from '@/sections/access/AccessRepositoryContext'
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
  const [selectedDownloadFormat, setSelectedDownloadFormat] = useState<FileDownloadMode>(
    FileDownloadMode.ORIGINAL
  )
  const accessRepository = useAccessRepository()
  const isBelow768px = useMediaQuery('(max-width: 768px)')

  const fileSelectionCount = Object.keys(fileSelection).length
  const allFilesSelected = Object.values(fileSelection).some((file) => file === undefined)
  const fileIdsForGuestbookSubmission = allFilesSelected
    ? undefined
    : getFileIdsFromSelection(fileSelection)
  const hasGuestbook = dataset?.guestbookId !== undefined

  const onClick = (event: MouseEvent<HTMLElement>, downloadMode: FileDownloadMode) => {
    if (fileSelectionCount === SELECTED_FILES_EMPTY) {
      event.preventDefault()
      setShowNoFilesSelectedModal(true)
      return
    }

    if (hasGuestbook) {
      event.preventDefault()
      setSelectedDownloadFormat(downloadMode)
      setShowDownloadWithGuestbookModal(true)
      return
    }

    event.preventDefault()
    void requestSignedDownloadUrlFromAccessApi({
      accessRepository,
      datasetId: allFilesSelected ? dataset?.id : undefined,
      fileIds: allFilesSelected ? undefined : getFileIdsFromSelection(fileSelection),
      guestbookResponse: EMPTY_GUESTBOOK_RESPONSE,
      format: downloadMode
    })
      .then(downloadFromSignedUrl)
      .then(() => {
        toast.success(t('actions.optionsMenu.guestbookCollectModal.downloadStarted'))
      })
      .catch(() => {
        toast.error(t('actions.optionsMenu.guestbookCollectModal.downloadError'))
      })
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

  const dropdownButtonTitle = isBelow768px
    ? ''
    : /* istanbul ignore next */ t('actions.downloadFiles.title')

  const downloadFeedbackModals = (
    <>
      <NoSelectedFilesModal
        show={showNoFilesSelectedModal}
        handleClose={() => setShowNoFilesSelectedModal(false)}
      />
      {hasGuestbook && showDownloadWithGuestbookModal && (
        <DownloadWithGuestbookModal
          fileIds={fileIdsForGuestbookSubmission}
          datasetId={allFilesSelected ? dataset.id : undefined}
          guestbookId={dataset.guestbookId}
          format={selectedDownloadFormat}
          datasetPersistentId={dataset.persistentId}
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
          <DropdownButtonItem onClick={(event) => onClick(event, FileDownloadMode.ORIGINAL)}>
            {t('actions.downloadFiles.options.original')}
          </DropdownButtonItem>
          <DropdownButtonItem onClick={(event) => onClick(event, FileDownloadMode.ARCHIVAL)}>
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
          onClick={(event) => onClick(event, FileDownloadMode.ORIGINAL)}>
          {dropdownButtonTitle}
        </Button>
      ) : (
        <Button
          id="download-files"
          variant="secondary"
          icon={<Download className={styles.icon} />}
          aria-label={t('actions.downloadFiles.title')}
          withSpacing
          onClick={(event) => onClick(event, FileDownloadMode.ORIGINAL)}>
          {dropdownButtonTitle}
        </Button>
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
