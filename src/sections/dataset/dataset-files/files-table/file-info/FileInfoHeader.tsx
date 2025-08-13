import styles from '../FilesTable.module.scss'
import { PaginationResultsInfo } from '../../../../shared/pagination/PaginationResultsInfo'
import { FilePaginationInfo } from '../../../../../files/domain/models/FilePaginationInfo'

interface FileInfoHeaderProps {
  paginationInfo: FilePaginationInfo
  accumulatedFilesCount?: number
}

export function FileInfoHeader({ paginationInfo, accumulatedFilesCount }: FileInfoHeaderProps) {
  const fileCount = paginationInfo.totalItems

  if (fileCount === 0) {
    return (
      <span className={styles['file-info-header--sr-only']}>
        {`${fileCount} ${paginationInfo.itemName}`}
      </span>
    )
  }
  return (
    <span className={styles['file-info-header']}>
      <PaginationResultsInfo paginationInfo={paginationInfo} accumulated={accumulatedFilesCount} />
    </span>
  )
}
