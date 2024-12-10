import { useState } from 'react'
import { Button, Col, Row } from '@iqss/dataverse-design-system'
import { X as CloseIcon } from 'react-bootstrap-icons'
import { CollectionItemsFacet } from '@/collection/domain/models/CollectionItemSubset'
import { FilterQuery } from '@/collection/domain/models/GetCollectionItemsQueryParams'
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
                role="option"
                aria-selected={isFacetLabelSelected}
                aria-label={
                  isFacetLabelSelected ? `Remove ${label.name} filter` : `Add ${label.name} filter`
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
        <Row>
          <Col>
            {showLessButton && (
              <Button
                variant="link"
                size="sm"
                onClick={handleShowLess}
                disabled={isLoadingCollectionItems}>
                Less...
              </Button>
            )}
          </Col>
          <Col className={styles['show-more']}>
            {showMoreButton && (
              <Button
                variant="link"
                size="sm"
                onClick={handleShowMore}
                disabled={isLoadingCollectionItems}>
                More...
              </Button>
            )}
          </Col>
        </Row>
      )}
    </li>
  )
}
