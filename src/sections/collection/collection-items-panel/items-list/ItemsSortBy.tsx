import { ArrowDownUp } from 'react-bootstrap-icons'
import styles from './ItemsList.module.scss'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { SortType } from '@/collection/domain/models/CollectionSearchCriteria'
import { OrderType } from '@/collection/domain/models/CollectionSearchCriteria'

export enum SortOption {
  NAME_ASC = 'nameAsc',
  NAME_DESC = 'nameDesc',
  DATE_ASC = 'dateAsc',
  DATE_DESC = 'dateDesc',
  RELEVANCE = 'relevance'
}

interface ItemsSortByProps {
  currentSortType?: SortType
  currentSortOrder?: OrderType
  currentQuery?: string
  onSortChange: (newSortType: SortType, newOrderType: OrderType) => void
  isLoadingCollectionItems: boolean
}
function convertToSortOption(sortType?: SortType, orderType?: OrderType): SortOption {
  if (sortType === SortType.NAME) {
    return orderType === OrderType.ASC ? SortOption.NAME_ASC : SortOption.NAME_DESC
  } else if (sortType === SortType.DATE) {
    return orderType === OrderType.ASC ? SortOption.DATE_ASC : SortOption.DATE_DESC
  } else {
    return SortOption.RELEVANCE
  }
}
function convertFromSortOption(sortOption: SortOption): {
  sortType: SortType
  orderType: OrderType
} {
  switch (sortOption) {
    case SortOption.NAME_ASC:
      return { sortType: SortType.NAME, orderType: OrderType.ASC }
    case SortOption.NAME_DESC:
      return { sortType: SortType.NAME, orderType: OrderType.DESC }
    case SortOption.DATE_ASC:
      return { sortType: SortType.DATE, orderType: OrderType.ASC }
    case SortOption.DATE_DESC:
      return { sortType: SortType.DATE, orderType: OrderType.DESC }
    case SortOption.RELEVANCE:
      return { sortType: SortType.SCORE, orderType: OrderType.DESC }
  }
}

export function ItemsSortBy({
  currentSortType,
  currentSortOrder,
  onSortChange,
  isLoadingCollectionItems
}: ItemsSortByProps) {
  const { t } = useTranslation('collection')
  const [selectedOption, setSelectedOption] = useState<SortOption>(
    convertToSortOption(currentSortType, currentSortOrder)
  )
  const handleSortChange = (eventKey: string | null) => {
    if (selectedOption !== eventKey) {
      setSelectedOption(eventKey as SortOption)
      onSortChange(
        convertFromSortOption(selectedOption).sortType,
        convertFromSortOption(selectedOption).orderType
      )
    }
  }

  return (
    <DropdownButton
      icon={<ArrowDownUp className={styles.icon} role="img" aria-label={t('sort.title')} />}
      title={t('sort.title')}
      id="collection-items-sort"
      variant="secondary"
      onSelect={handleSortChange}>
      {Object.values(SortOption).map((sortByOption) => (
        <DropdownButtonItem
          key={sortByOption}
          eventKey={sortByOption}
          className={selectedOption === sortByOption ? styles['selected-option'] : ''}>
          {t(`sort.options.${sortByOption}`)}
        </DropdownButtonItem>
      ))}
    </DropdownButton>
  )
}
