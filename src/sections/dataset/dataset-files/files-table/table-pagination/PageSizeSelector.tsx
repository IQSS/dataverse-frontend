import styles from './TablePagination.module.scss'
import { useTranslation } from 'react-i18next'

export function PageSizeSelector({
  pageSize,
  setPageSize
}: {
  pageSize: number
  setPageSize: (pageSize: number) => void
}) {
  const { t } = useTranslation('files')
  const availableSizes = [10, 25, 50]

  return (
    <div className={styles['size-selector-container']}>
      <label htmlFor="files-per-page-selector" className={styles['size-selector-container__text']}>
        {t('table.pagination.pageSize')}
      </label>
      <select
        id="files-per-page-selector"
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value))
        }}>
        {availableSizes.map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            {pageSize}
          </option>
        ))}
      </select>
    </div>
  )
}
