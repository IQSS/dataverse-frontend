import { ArrowDownUp } from 'react-bootstrap-icons'
import styles from './ItemsList.module.scss'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { SortType } from '@/collection/domain/models/CollectionSearchCriteria'
import { OrderType } from '@/collection/domain/models/CollectionSearchCriteria'

export enum SortOption {
  NAME_ASC = 'nameAsc',
  NAME_DESC = 'nameDesc',
  DATE_DESC = 'dateDesc',
  DATE_ASC = 'dateAsc',
  RELEVANCE = 'relevance'
}

interface ItemsSortByProps {
  currentSortType?: SortType
  currentSortOrder?: OrderType
  hasSearchValue?: boolean
  onSortChange: (newSortType?: SortType, newOrderType?: OrderType) => void
  isLoadingCollectionItems: boolean
}

export function ItemsSortBy({
  currentSortType,
  currentSortOrder,
  onSortChange,
  hasSearchValue,
  isLoadingCollectionItems
}: ItemsSortByProps) {
  const { t } = useTranslation('collection')
  const [selectedOption, setSelectedOption] = useState<SortOption>(
    convertToSortOption(currentSortType, currentSortOrder, hasSearchValue)
  )
  useEffect(() => {
    const newSortOption = convertToSortOption(currentSortType, currentSortOrder, hasSearchValue)
    if (newSortOption !== selectedOption) {
      setSelectedOption(newSortOption)
    }
  }, [currentSortType, currentSortOrder, hasSearchValue, selectedOption])

  const handleSortChange = (eventKey: string | null) => {
    const newSortOption = eventKey as SortOption
    if (selectedOption !== newSortOption) {
      setSelectedOption(newSortOption)
      onSortChange(
        convertFromSortOption(newSortOption).sortType,
        convertFromSortOption(newSortOption).orderType
      )
    }
  }

  const sortOptions = Object.values(SortOption).filter(
    (sortByOption) => sortByOption !== SortOption.RELEVANCE || hasSearchValue
  )

  return (
    <DropdownButton
      icon={<ArrowDownUp className={styles.icon} role="img" aria-label={t('sort.title')} />}
      title={t('sort.title')}
      id="collection-items-sort"
      variant="secondary"
      disabled={isLoadingCollectionItems}
      onSelect={handleSortChange}>
      {Object.values(sortOptions).map((sortByOption) => (
        <DropdownButtonItem
          key={sortByOption}
          eventKey={sortByOption}
          aria-selected={selectedOption === sortByOption}
          className={selectedOption === sortByOption ? styles['selected-sort-option'] : ''}>
          {t(`sort.options.${sortByOption}`)}
        </DropdownButtonItem>
      ))}
    </DropdownButton>
  )
}
function convertToSortOption(
  sortType?: SortType,
  orderType?: OrderType,
  hasSearchValue?: boolean
): SortOption {
  let sortOption: SortOption
  if (sortType === SortType.NAME) {
    sortOption = orderType === OrderType.ASC ? SortOption.NAME_ASC : SortOption.NAME_DESC
  } else if (sortType === SortType.DATE) {
    sortOption = orderType === OrderType.ASC ? SortOption.DATE_ASC : SortOption.DATE_DESC
  } else if (hasSearchValue) {
    sortOption = SortOption.RELEVANCE
  } else {
    sortOption = SortOption.DATE_DESC
  }
  return sortOption
}
function convertFromSortOption(sortOption: SortOption): {
  sortType?: SortType
  orderType?: OrderType
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
      return { sortType: undefined, orderType: undefined }
  }
}
