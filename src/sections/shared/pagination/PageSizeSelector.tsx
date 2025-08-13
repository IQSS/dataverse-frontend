import styles from './Pagination.module.scss'
import { useTranslation } from 'react-i18next'

export function PageSizeSelector({
  itemName,
  pageSize,
  setPageSize
}: {
  itemName: string
  pageSize: number
  setPageSize: (pageSize: number) => void
}) {
  const { t } = useTranslation('shared', { keyPrefix: 'pagination' })
  const availableSizes = [10, 25, 50]

  return (
    <div className={styles['size-selector-container']}>
      <label htmlFor="files-per-page-selector" className={styles['size-selector-container__text']}>
        {t('pageSize', {
          item: itemName
        })}
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
