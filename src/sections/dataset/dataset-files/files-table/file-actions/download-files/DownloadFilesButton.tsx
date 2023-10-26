import { File } from '../../../../../../files/domain/models/File'
import { useDataset } from '../../../../DatasetContext'
import { Button, DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { Download } from 'react-bootstrap-icons'
import styles from './DownloadFilesButton.module.scss'
import { useTranslation } from 'react-i18next'

interface DownloadFilesButtonProps {
  files: File[]
}

const MINIMUM_FILES_COUNT_TO_SHOW_DOWNLOAD_FILES_BUTTON = 1
export function DownloadFilesButton({ files }: DownloadFilesButtonProps) {
  const { t } = useTranslation('files')
  const { dataset } = useDataset()

  if (
    files.length < MINIMUM_FILES_COUNT_TO_SHOW_DOWNLOAD_FILES_BUTTON ||
    !dataset?.permissions.canDownloadFiles
  ) {
    return <></>
  }

  if (files.some((file) => file.isTabularData)) {
    return (
      <DropdownButton
        id="download-files"
        icon={<Download className={styles.icon} />}
        title={t('actions.downloadFiles.title')}
        variant="secondary"
        withSpacing>
        <DropdownButtonItem>{t('actions.downloadFiles.options.original')}</DropdownButtonItem>
        <DropdownButtonItem>{t('actions.downloadFiles.options.archival')}</DropdownButtonItem>
      </DropdownButton>
    )
  }

  return (
    <Button variant="secondary" icon={<Download className={styles.icon} />} withSpacing>
      {t('actions.downloadFiles.title')}
    </Button>
  )
}
