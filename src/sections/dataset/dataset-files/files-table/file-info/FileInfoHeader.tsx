import styles from '../FilesTable.module.scss'
import { FilePaginationInfo } from '../../../../../files/domain/models/FilePaginationInfo'

interface FileInfoHeaderProps {
  paginationInfo: FilePaginationInfo
}

export function FileInfoHeader({ paginationInfo }: FileInfoHeaderProps) {
  const fileCount = paginationInfo.total
  const startIndex = (paginationInfo.page - 1) * paginationInfo.pageSize + 1
  const endIndex = Math.min(startIndex + paginationInfo.pageSize - 1, fileCount)

  if (fileCount === 0) {
    return <></>
  }
  return (
    <span className={styles['file-info-header']}>
      {`${startIndex} to ${endIndex} of ${fileCount} Files`}
    </span>
  )
}
