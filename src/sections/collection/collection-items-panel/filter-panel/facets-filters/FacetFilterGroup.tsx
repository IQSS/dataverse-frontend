import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { Button, Col, Row } from '@iqss/dataverse-design-system'
import { X as CloseIcon } from 'react-bootstrap-icons'
import { CollectionItemsFacet } from '@/collection/domain/models/CollectionItemSubset'
import { FilterQuery } from '@/collection/domain/models/CollectionSearchCriteria'
import styles from './FacetsFilters.module.scss'

const FACETS_PER_VIEW = 5

export enum RemoveAddFacetFilter {
  REMOVE = 'remove',
  ADD = 'add'
}

interface FacetFilterGroupProps {
  facet: CollectionItemsFacet
  facetSelectedLabels?: string[]
  onFacetChange: (filterQuery: FilterQuery, removeOrAdd: RemoveAddFacetFilter) => void
  isLoadingCollectionItems: boolean
}

export const FacetFilterGroup = ({
  facet,
  facetSelectedLabels,
  onFacetChange,
  isLoadingCollectionItems
}: FacetFilterGroupProps) => {
  const { t } = useTranslation('collection')
  const { t: tShared } = useTranslation('shared')

  const [visibleCount, setVisibleCount] = useState(FACETS_PER_VIEW)

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + FACETS_PER_VIEW, facet.labels.length))
  }

  const handleShowLess = () => {
    setVisibleCount((prev) => Math.max(prev - FACETS_PER_VIEW, FACETS_PER_VIEW))
  }

  const handleClickFacetLabel = (facetName: string, labelName: string) => {
    const filterQuery: FilterQuery = `${facetName}:${labelName}`
    const shouldRemoveOrAdd = facetSelectedLabels?.includes(labelName)
      ? RemoveAddFacetFilter.REMOVE
      : RemoveAddFacetFilter.ADD

    onFacetChange(filterQuery, shouldRemoveOrAdd)
  }

  const showMoreButton = visibleCount < facet.labels.length
  const showLessButton = visibleCount > FACETS_PER_VIEW
  const showMoreLessButtons =
    (showMoreButton || showLessButton) && facet.labels.length > FACETS_PER_VIEW

  return (
    <li key={facet.name} className={styles['facet-filter-group']}>
      <span className={styles['facet-name']}>{facet.friendlyName}</span>
      <ul className={styles['labels-list']}>
        {facet.labels.slice(0, visibleCount).map((label) => {
          const isFacetLabelSelected = Boolean(facetSelectedLabels?.includes(label.name))

          return (
            <li key={label.name}>
              <Button
                onClick={() => handleClickFacetLabel(facet.name, label.name)}
                className={cn(styles['facet-label-button'], {
                  [styles['selected']]: isFacetLabelSelected
                })}
                aria-label={
                  isFacetLabelSelected
                    ? t('removeSelectedFacet', { labelName: label.name })
                    : t('addFacetFilter', { labelName: label.name })
                }
                disabled={isLoadingCollectionItems}
                variant="link"
                size="sm">
                <span>{`${label.name} (${label.count})`}</span>
                {isFacetLabelSelected && <CloseIcon size={22} />}
              </Button>
            </li>
          )
        })}
      </ul>

      {showMoreLessButtons && (
        <Row className={styles['show-less-more']}>
          <Col>
            {showLessButton && (
              <Button
                variant="link"
                size="sm"
                onClick={handleShowLess}
                disabled={isLoadingCollectionItems}>
                {tShared('less')}
              </Button>
            )}
          </Col>
          <Col>
            {showMoreButton && (
              <Button
                variant="link"
                size="sm"
                onClick={handleShowMore}
                disabled={isLoadingCollectionItems}>
                {tShared('more')}
              </Button>
            )}
          </Col>
        </Row>
      )}
    </li>
  )
}
