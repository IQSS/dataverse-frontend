import styles from '../FilesTable.module.scss'

interface FileInfoHeaderProps {
  pageCount: number
  pageIndex: number
  pageSize: number
}

export function FileInfoHeader({ pageCount, pageIndex, pageSize }: FileInfoHeaderProps) {
  const startIndex = pageIndex * pageSize + 1
  const fileCount = pageCount * pageSize
  const endIndex = Math.min(startIndex + pageSize - 1, fileCount)

  if (fileCount === 0) {
    return <></>
  }
  return (
    <span className={styles['file-info-header']}>
      {`${startIndex} to ${endIndex} of ${fileCount} Files`}
    </span>
  )
}
