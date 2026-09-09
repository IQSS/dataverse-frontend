import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { Button, Col, Row } from '@iqss/dataverse-design-system'
import { X as CloseIcon } from 'react-bootstrap-icons'
import { CollectionItemsFacet } from '@/collection/domain/models/CollectionItemSubset'
import { FilterQuery } from '@/collection/domain/models/CollectionSearchCriteria'
import styles from './FacetsFilters.module.scss'

const FACETS_PER_VIEW = 5

const FACET_NAME_TRANSLATION_KEY_BY_NAME: Record<string, string> = {
  subject_ss: 'facets.names.subject',
  authorName_ss: 'facets.names.authorName',
  authorAffiliation_ss: 'facets.names.authorAffiliation'
}

const SUBJECT_TRANSLATION_KEY_BY_VALUE: Record<string, string> = {
  'Agricultural Sciences': 'facets.subjectValues.agriculturalSciences',
  'Arts and Humanities': 'facets.subjectValues.artsAndHumanities',
  'Astronomy and Astrophysics': 'facets.subjectValues.astronomyAndAstrophysics',
  'Business and Management': 'facets.subjectValues.businessAndManagement',
  Chemistry: 'facets.subjectValues.chemistry',
  'Computer and Information Science': 'facets.subjectValues.computerAndInformationScience',
  'Earth and Environmental Sciences': 'facets.subjectValues.earthAndEnvironmentalSciences',
  Engineering: 'facets.subjectValues.engineering',
  Law: 'facets.subjectValues.law',
  'Mathematical Sciences': 'facets.subjectValues.mathematicalSciences',
  'Medicine, Health and Life Sciences': 'facets.subjectValues.medicineHealthAndLifeSciences',
  Physics: 'facets.subjectValues.physics',
  'Social Sciences': 'facets.subjectValues.socialSciences',
  Other: 'facets.subjectValues.other'
}

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
  const { t, i18n } = useTranslation('collection')
  const { t: tShared } = useTranslation('shared')

  const [visibleCount, setVisibleCount] = useState(FACETS_PER_VIEW)
  const facetNameTranslationKey = Object.hasOwn(FACET_NAME_TRANSLATION_KEY_BY_NAME, facet.name)
    ? FACET_NAME_TRANSLATION_KEY_BY_NAME[facet.name]
    : undefined
  const facetDisplayName = facetNameTranslationKey
    ? t(facetNameTranslationKey, { defaultValue: facet.friendlyName })
    : facet.friendlyName
  const numberFormatter = new Intl.NumberFormat(i18n.resolvedLanguage || i18n.language)

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
      <span className={styles['facet-name']}>{facetDisplayName}</span>
      <ul className={styles['labels-list']}>
        {[...facet.labels]
          .sort((a, b) =>
            facet.name === 'publicationDate' || facet.name === 'dateOfDeposit'
              ? parseFloat(b.name) - parseFloat(a.name)
              : 0
          )
          .slice(0, visibleCount)
          .map((label) => {
            const isFacetLabelSelected = Boolean(facetSelectedLabels?.includes(label.name))
            const subjectTranslationKey =
              facet.name === 'subject_ss' &&
              Object.hasOwn(SUBJECT_TRANSLATION_KEY_BY_VALUE, label.name)
                ? SUBJECT_TRANSLATION_KEY_BY_VALUE[label.name]
                : undefined
            const labelDisplayName = subjectTranslationKey
              ? t(subjectTranslationKey, { defaultValue: label.name })
              : label.name

            return (
              <li key={label.name}>
                <Button
                  onClick={() => handleClickFacetLabel(facet.name, label.name)}
                  className={cn(styles['facet-label-button'], {
                    [styles['selected']]: isFacetLabelSelected
                  })}
                  aria-label={
                    isFacetLabelSelected
                      ? t('removeSelectedFacet', { labelName: labelDisplayName })
                      : t('addFacetFilter', { labelName: labelDisplayName })
                  }
                  disabled={isLoadingCollectionItems}
                  variant="link"
                  size="sm">
                  <span>{`${labelDisplayName} (${numberFormatter.format(label.count)})`}</span>
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
