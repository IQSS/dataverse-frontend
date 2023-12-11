import { File } from '../../../../../../files/domain/models/File'
import { useDataset } from '../../../../DatasetContext'
import { Button, DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { Download } from 'react-bootstrap-icons'
import styles from './DownloadFilesButton.module.scss'
import { useTranslation } from 'react-i18next'
import { FileSelection } from '../../row-selection/useFileSelection'
import { NoSelectedFilesModal } from '../no-selected-files-modal/NoSelectedFilesModal'
import { useState } from 'react'
import { useNotImplementedModal } from '../../../../../not-implemented/NotImplementedModalContext'

interface DownloadFilesButtonProps {
  files: File[]
  fileSelection: FileSelection
}

const MINIMUM_FILES_COUNT_TO_SHOW_DOWNLOAD_FILES_BUTTON = 1
const SELECTED_FILES_EMPTY = 0

export function DownloadFilesButton({ files, fileSelection }: DownloadFilesButtonProps) {
  const { t } = useTranslation('files')
  const { dataset } = useDataset()
  const [showNoFilesSelectedModal, setShowNoFilesSelectedModal] = useState(false)
  const handleClick = () => {
    // TODO - Implement upload files
    showModal()
  }
  const { showModal } = useNotImplementedModal()
  if (
    files.length < MINIMUM_FILES_COUNT_TO_SHOW_DOWNLOAD_FILES_BUTTON ||
    !dataset?.permissions.canDownloadFiles
  ) {
    return <></>
  }

  const onClick = () => {
    if (Object.keys(fileSelection).length === SELECTED_FILES_EMPTY) {
      setShowNoFilesSelectedModal(true)
    } else {
      handleClick()
    }
  }

  if (files.some((file) => file.isTabularData)) {
    return (
      <>
        <DropdownButton
          id="download-files"
          icon={<Download className={styles.icon} />}
          title={t('actions.downloadFiles.title')}
          variant="secondary"
          withSpacing>
          <DropdownButtonItem onClick={onClick}>
            {t('actions.downloadFiles.options.original')}
          </DropdownButtonItem>
          <DropdownButtonItem onClick={onClick}>
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
      <Button
        variant="secondary"
        icon={<Download className={styles.icon} />}
        withSpacing
        onClick={onClick}>
        {t('actions.downloadFiles.title')}
      </Button>
      <NoSelectedFilesModal
        show={showNoFilesSelectedModal}
        handleClose={() => setShowNoFilesSelectedModal(false)}
      />
    </>
  )
}
