import { useCallback, useMemo } from 'react'
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
  const { t, i18n } = useTranslation('shared', { keyPrefix: 'pagination' })
  const locale = i18n.resolvedLanguage || i18n.language

  const defineLocale = useCallback(
    (accumulated: number) =>
      accumulated === 1
        ? 'accumulated.one'
        : accumulated < paginationInfo.pageSize
        ? 'accumulated.lessThanPageSize'
        : 'accumulated.moreThanPageSize',
    [paginationInfo.pageSize]
  )

  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale])
  const formattedCount = useMemo(
    () => numberFormatter.format(paginationInfo.totalItems),
    [numberFormatter, paginationInfo.totalItems]
  )

  return (
    <span className={styles.results}>
      {typeof accumulated === 'number'
        ? t(defineLocale(accumulated), {
            accumulated: numberFormatter.format(accumulated),
            count: paginationInfo.totalItems,
            formattedCount: formattedCount,
            item: paginationInfo.itemName
          })
        : t('results', {
            start: numberFormatter.format(paginationInfo.pageStartItem),
            end: numberFormatter.format(paginationInfo.pageEndItem),
            item: paginationInfo.itemName,
            count: paginationInfo.totalItems,
            formattedCount: formattedCount
          })}
    </span>
  )
}
