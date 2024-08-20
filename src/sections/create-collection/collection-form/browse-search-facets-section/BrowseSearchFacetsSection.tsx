import { useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Col,
  Form,
  Row,
  Stack,
  TransferList,
  TransferListItem
} from '@iqss/dataverse-design-system'
import { MetadataField } from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { CollectionFormFacet, FACET_IDS_FIELD, USE_FACETS_FROM_PARENT } from '../CollectionForm'
import { FacetsFromParentCheckbox } from './FacetsFromParentCheckbox'
import cn from 'classnames'
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
  const useBrowseSearchFacetsFromParentCheckedValue = useWatch({
    name: USE_FACETS_FROM_PARENT
  }) as boolean

  // To reset the transfer list when the use browse search facets from parent checkbox changes
  const transferListKey = String(useBrowseSearchFacetsFromParentCheckedValue)

  // TODO:ME When we have info about parent block name of each facetable field, we should use it to group the facets in a Select.
  const [availableItems, setAvailableItems] = useState<TransferListItem[]>(
    allFacetableMetadataFields.map((field) => ({
      id: field.name,
      value: field.name,
      label: field.displayName
    }))
  )

  const handleOnChangeSelectedItems = (
    selectedItems: TransferListItem[],
    formOnChange: (...event: unknown[]) => void
  ) => {
    const formattedSelectedItems = selectedItems.map(
      (selectedItem) =>
        ({
          id: selectedItem.id,
          label: selectedItem.label,
          value: selectedItem.value
        } as CollectionFormFacet)
    )

    formOnChange(formattedSelectedItems)
  }

  return (
    <Row>
      <Col lg={3}>
        <Form.Group.Label>{t('fields.browseSearchFacets.label')}</Form.Group.Label>
      </Col>
      <Col lg={9}>
        <Stack>
          <Form.Group.Text>{t('fields.browseSearchFacets.helperText')}</Form.Group.Text>

          <FacetsFromParentCheckbox defaultCollectionFacets={defaultCollectionFacets} />

          <div
            className={cn(style['transfer-list-container'], {
              [style['transfer-list-container--disabled']]:
                useBrowseSearchFacetsFromParentCheckedValue
            })}
            data-testid="transfer-list-container">
            <Controller
              name={FACET_IDS_FIELD}
              control={control}
              render={({ field: { onChange } }) => (
                <TransferList
                  onChange={(selectedItems) => handleOnChangeSelectedItems(selectedItems, onChange)}
                  availableItems={availableItems}
                  defaultSelected={defaultCollectionFacets}
                  rightLabel="Selected"
                  key={transferListKey}
                />
              )}
            />
          </div>
        </Stack>
      </Col>
    </Row>
  )
}
