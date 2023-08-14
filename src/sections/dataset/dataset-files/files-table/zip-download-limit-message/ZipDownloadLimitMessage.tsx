import { useTranslation } from 'react-i18next'
import styles from './ZipLimitMessage.module.scss'
import { File, FileSizeUnit } from '../../../../../files/domain/models/File'
import { useSettings } from '../../../../settings/SettingsContext'
import { SettingName } from '../../../../../settings/domain/models/Setting'
import { ZipDownloadLimit } from '../../../../../settings/domain/models/ZipDownloadLimit'
import { useEffect, useState } from 'react'

interface ZipDownloadLimitMessageProps {
  selectedFiles: File[]
}

const MINIMUM_FILES_TO_SHOW_MESSAGE = 1

export function ZipDownloadLimitMessage({ selectedFiles }: ZipDownloadLimitMessageProps) {
  const { t } = useTranslation('files')
  const { getSettingByName } = useSettings()
  const [zipDownloadLimitInBytes, setZipDownloadLimitInBytes] = useState<number>()
  const selectionTotalSizeInBytes = getFilesTotalSizeInBytes(selectedFiles)

  useEffect(() => {
    getSettingByName<ZipDownloadLimit>(SettingName.ZIP_DOWNLOAD_LIMIT)
      .then((zipDownloadLimit) => {
        setZipDownloadLimitInBytes(zipDownloadLimit.value.toBytes())
      })
      .catch((error) => {
        console.error(error)
      })
  }, [getSettingByName])

  const showMessage =
    zipDownloadLimitInBytes &&
    selectedFiles.length > MINIMUM_FILES_TO_SHOW_MESSAGE &&
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

function getFilesTotalSizeInBytes(files: File[]) {
  return files.map((file) => file.size).reduce((bytes, size) => bytes + size.toBytes(), 0)
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
