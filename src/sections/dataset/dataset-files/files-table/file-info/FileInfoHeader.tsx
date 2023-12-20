import styles from '../FilesTable.module.scss'
import { PaginationResultsInfo } from '../../../../shared/pagination/PaginationResultsInfo'
import { FilePaginationInfo } from '../../../../../files/domain/models/FilePaginationInfo'

interface FileInfoHeaderProps {
  paginationInfo: FilePaginationInfo
}

export function FileInfoHeader({ paginationInfo }: FileInfoHeaderProps) {
  const fileCount = paginationInfo.totalItems

  if (fileCount === 0) {
    return <></>
  }
  return (
    <span className={styles['file-info-header']}>
      <PaginationResultsInfo paginationInfo={paginationInfo} />
    </span>
  )
}
