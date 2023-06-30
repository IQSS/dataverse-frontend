import styles from './TablePagination.module.scss'

export function PageSizeSelector({
  pageSize,
  setPageSize
}: {
  pageSize: number
  setPageSize: (pageSize: number) => void
}) {
  return (
    <div className={styles['size-selector-container']}>
      <label htmlFor="page-size-selector" className={styles['size-selector-container__text']}>
        Files per page
      </label>
      <select
        id="page-size-selector"
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value))
        }}>
        {[10, 25, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            {pageSize}
          </option>
        ))}
      </select>
    </div>
  )
}
