import { useTranslation } from 'react-i18next'
import styles from './ZipLimitMessage.module.scss'
import { File, FileSizeUnit } from '../../../../../files/domain/models/File'
import { useSettings } from '../../../../settings/SettingsContext'
import { SettingName } from '../../../../../settings/domain/models/Setting'
import { ZipDownloadLimit } from '../../../../../settings/domain/models/ZipDownloadLimit'
import { useEffect, useState } from 'react'
import { FileSelection } from '../row-selection/useFileSelection'

interface ZipDownloadLimitMessageProps {
  fileSelection: FileSelection
}

const MINIMUM_FILES_TO_SHOW_MESSAGE = 1

export function ZipDownloadLimitMessage({ fileSelection }: ZipDownloadLimitMessageProps) {
  const { t } = useTranslation('files')
  const { getSettingByName } = useSettings()
  const [zipDownloadLimitInBytes, setZipDownloadLimitInBytes] = useState<number>()
  useEffect(() => {
    getSettingByName<ZipDownloadLimit>(SettingName.ZIP_DOWNLOAD_LIMIT)
      .then((zipDownloadLimit) => {
        setZipDownloadLimitInBytes(zipDownloadLimit.value.toBytes())
      })
      .catch((error) => {
        console.error(error)
      })
  }, [getSettingByName])

  // TODO - When selecting all files, the size should come from a call to a use case that returns the total size of the dataset files. Check issue https://github.com/IQSS/dataverse-frontend/issues/170
  const selectionTotalSizeInBytes = getFilesTotalSizeInBytes(Object.values(fileSelection))
  const showMessage =
    zipDownloadLimitInBytes &&
    Object.values(fileSelection).length > MINIMUM_FILES_TO_SHOW_MESSAGE &&
    selectionTotalSizeInBytes > zipDownloadLimitInBytes

  if (!showMessage) {
    return <></>
  }
  return (
    <div className={styles.container}>
      <span className={styles.message}>
        {t('table.zipDownloadExceedsLimit', {
          selectionTotalSize: bytesToHumanReadable(selectionTotalSizeInBytes),
          zipDownloadSizeLimit: bytesToHumanReadable(zipDownloadLimitInBytes)
        })}
      </span>
    </div>
  )
}

function getFilesTotalSizeInBytes(files: (File | undefined)[]) {
  return files
    .map((file) => file?.size)
    .reduce((bytes, size) => bytes + (size ? size.toBytes() : 0), 0)
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
