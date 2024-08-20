import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Col, Form, Row, TransferList, TransferListItem } from '@iqss/dataverse-design-system'
import { MetadataField } from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { CollectionFormFacet, FACET_IDS_FIELD } from '../CollectionForm'
import style from './BrowseSearchFacetsSection.module.scss'

interface BrowseSearchFacetsSectionProps {
  defaultCollectionFacets: CollectionFormFacet[]
  allFacetableMetadataFields: MetadataField[]
}

export const BrowseSearchFacetsSection = ({
  defaultCollectionFacets,
  allFacetableMetadataFields
}: BrowseSearchFacetsSectionProps) => {
  const { t } = useTranslation('createCollection')
  const { control } = useFormContext()

  // TODO:ME When we have info about parent block name of each facetable field, we should use it to group the facets in a Select.
  const [availableItems, setAvailableItems] = useState<TransferListItem[]>(
    allFacetableMetadataFields.map((field) => ({
      id: field.name,
      value: field.name,
      label: field.displayName
    }))
  )

  const transformSelectedItemsToColletionFormFacets = (
    selectedItems: TransferListItem[]
  ): CollectionFormFacet[] => {
    return selectedItems.map(
      (selectedItem) =>
        ({
          id: selectedItem.id,
          label: selectedItem.label,
          value: selectedItem.value
        } as CollectionFormFacet)
    )
  }

  const handleOnChangeSelectedItems = (
    selectedItems: TransferListItem[],
    formOnChange: (...event: unknown[]) => void
  ) => {
    const formattedSelectedItems = transformSelectedItemsToColletionFormFacets(selectedItems)

    formOnChange(formattedSelectedItems)
  }

  return (
    <Row>
      <Col lg={3}>
        <Form.Group.Label>{t('fields.browseSearchFacets.label')}</Form.Group.Label>
      </Col>
      <Col lg={9}>
        <Form.Group.Text>{t('fields.browseSearchFacets.helperText')}</Form.Group.Text>
        <div className={style['transfer-list-container']}>
          <Controller
            name={FACET_IDS_FIELD}
            control={control}
            render={({ field: { onChange } }) => (
              <TransferList
                onChange={(selectedItems) => handleOnChangeSelectedItems(selectedItems, onChange)}
                availableItems={availableItems}
                defaultSelected={defaultCollectionFacets}
                rightLabel="Selected"
              />
            )}
          />
        </div>
      </Col>
    </Row>
  )
}
