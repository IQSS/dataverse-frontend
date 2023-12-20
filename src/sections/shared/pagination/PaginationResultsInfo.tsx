import styles from './Pagination.module.scss'
import { PaginationInfo } from '../../../shared/domain/models/PaginationInfo'
import { useTranslation } from 'react-i18next'
import { DatasetPaginationInfo } from '../../../dataset/domain/models/DatasetPaginationInfo'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'

interface PaginationResultsInfoProps {
  paginationInfo: PaginationInfo<DatasetPaginationInfo | FilePaginationInfo>
}

export function PaginationResultsInfo({ paginationInfo }: PaginationResultsInfoProps) {
  const { t } = useTranslation('pagination')
  return (
    <span className={styles.results}>
      {t('results', {
        start: paginationInfo.pageStartItem,
        end: paginationInfo.pageEndItem,
        total: paginationInfo.totalItems,
        item: paginationInfo.itemName
      })}
    </span>
  )
}
