import { useCallback } from 'react'
import styles from './Pagination.module.scss'
import { PaginationInfo } from '../../../shared/pagination/domain/models/PaginationInfo'
import { useTranslation } from 'react-i18next'
import { DatasetPaginationInfo } from '../../../dataset/domain/models/DatasetPaginationInfo'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'

interface PaginationResultsInfoProps {
  paginationInfo: PaginationInfo<DatasetPaginationInfo | FilePaginationInfo>
  accumulated?: number
}

export function PaginationResultsInfo({ paginationInfo, accumulated }: PaginationResultsInfoProps) {
  const { t } = useTranslation('pagination')

  const defineLocale = useCallback(
    (accumulated: number) =>
      accumulated === 1
        ? 'accumulated.one'
        : accumulated < paginationInfo.pageSize
        ? 'accumulated.lessThanPageSize'
        : 'accumulated.moreThanPageSize',
    [accumulated, paginationInfo.pageSize]
  )

  return (
    <span className={styles.results}>
      {typeof accumulated === 'number'
        ? t(defineLocale(accumulated), {
            accumulated: accumulated,
            count: paginationInfo.totalItems,
            item: paginationInfo.itemName
          })
        : t('results', {
            start: paginationInfo.pageStartItem,
            end: paginationInfo.pageEndItem,
            item: paginationInfo.itemName,
            count: paginationInfo.totalItems
          })}
    </span>
  )
}
