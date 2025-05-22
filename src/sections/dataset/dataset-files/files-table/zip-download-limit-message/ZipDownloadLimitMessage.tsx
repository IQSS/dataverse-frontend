import { useTranslation } from 'react-i18next'
import styles from './ZipLimitMessage.module.scss'
import { FileSizeUnit } from '../../../../../files/domain/models/FileMetadata'
import { useSettings } from '../../../../settings/SettingsContext'
import { SettingName } from '../../../../../settings/domain/models/Setting'
import { ZipDownloadLimit } from '../../../../../settings/domain/models/ZipDownloadLimit'
import { useEffect, useState } from 'react'
import { FileSelection } from '../row-selection/useFileSelection'

interface ZipDownloadLimitMessageProps {
  fileSelection: FileSelection
  visitedFiles?: FileSelection
  filesTotalDownloadSize: number
}

const MINIMUM_FILES_TO_SHOW_MESSAGE = 1

export function ZipDownloadLimitMessage({
  fileSelection,
  visitedFiles,
  filesTotalDownloadSize
}: ZipDownloadLimitMessageProps) {
  const { t } = useTranslation('files')
  const { getSettingByName } = useSettings()
  const zipDownloadLimitInBytes = getSettingByName<ZipDownloadLimit>(
    SettingName.ZIP_DOWNLOAD_LIMIT
  )?.value.toBytes()

  const [fileSelectionTotalSizeInInBytes, setFileSelectionTotalSizeInInBytes] = useState<number>(0)
  useEffect(() => {
    const totalSize = computeFileSelectionTotalSizeInBytes(
      fileSelection,
      filesTotalDownloadSize,
      visitedFiles
    )
    setFileSelectionTotalSizeInInBytes(totalSize)
  }, [fileSelection, visitedFiles, filesTotalDownloadSize])

  const showMessage =
    zipDownloadLimitInBytes &&
    Object.values(fileSelection).length > MINIMUM_FILES_TO_SHOW_MESSAGE &&
    fileSelectionTotalSizeInInBytes > zipDownloadLimitInBytes

  if (!showMessage) {
    return <></>
  }
  return (
    <div className={styles.container}>
      <span className={styles.message}>
        {t('table.zipDownloadExceedsLimit', {
          selectionTotalSize: bytesToHumanReadable(fileSelectionTotalSizeInInBytes),
          zipDownloadSizeLimit: bytesToHumanReadable(zipDownloadLimitInBytes)
        })}
      </span>
    </div>
  )
}

function computeFileSelectionTotalSizeInBytes(
  fileSelection: FileSelection,
  filesTotalDownloadSize: number,
  visitedFiles?: FileSelection
) {
  const selectAllHasBeenClicked = Object.values(fileSelection).some((file) => file == undefined)
  if (selectAllHasBeenClicked) {
    const differenceBetweenPreviousAndCurrentSelection =
      getFilesTotalSize(visitedFiles ?? {}) - getFilesTotalSize(fileSelection)

    if (differenceBetweenPreviousAndCurrentSelection < 0) {
      return filesTotalDownloadSize
    }

    return filesTotalDownloadSize - differenceBetweenPreviousAndCurrentSelection
  }

  return getFilesTotalSize(fileSelection)
}

function getFilesTotalSize(fileSelection: FileSelection) {
  return Object.values(fileSelection)
    .filter((file) => file != undefined)
    .reduce((totalSize, file) => totalSize + (file ? file.metadata.size.toBytes() : 0), 0)
}

function bytesToHumanReadable(bytes: number) {
  const units = [
    FileSizeUnit.BYTES,
    FileSizeUnit.KILOBYTES,
    FileSizeUnit.MEGABYTES,
    FileSizeUnit.GIGABYTES,
    FileSizeUnit.TERABYTES,
    FileSizeUnit.PETABYTES
  ]
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024))
  const unit = units[unitIndex]

  if (unit == undefined) {
    return 'more than 1024.0 PB'
  }

  const value = bytes / Math.pow(1024, unitIndex)
  return `${value.toFixed(1)} ${unit}`
}
