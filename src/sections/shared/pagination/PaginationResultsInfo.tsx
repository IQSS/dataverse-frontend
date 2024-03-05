import styles from './Pagination.module.scss'
import { PaginationInfo } from '../../../shared/pagination/domain/models/PaginationInfo'
import { useTranslation } from 'react-i18next'
import { DatasetPaginationInfo } from '../../../dataset/domain/models/DatasetPaginationInfo'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'

interface PaginationResultsInfoProps {
  paginationInfo: PaginationInfo<DatasetPaginationInfo | FilePaginationInfo>
  forInfiniteScrolling?: boolean
}

export function PaginationResultsInfo({
  paginationInfo,
  forInfiniteScrolling = false
}: PaginationResultsInfoProps) {
  const { t } = useTranslation('pagination')

  return (
    <span className={styles.results}>
      {!forInfiniteScrolling
        ? t('results', {
            start: paginationInfo.pageStartItem,
            end: paginationInfo.pageEndItem,
            item: paginationInfo.itemName,
            count: paginationInfo.totalItems
          })
        : t('accumulated', {
            accumulated: paginationInfo.page * paginationInfo.pageSize,
            count: paginationInfo.totalItems,
            item: paginationInfo.itemName
          })}
    </span>
  )
}
