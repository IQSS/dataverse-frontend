import { useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Col,
  Form,
  Row,
  Stack,
  TransferList,
  TransferListItem,
  SelectAdvanced
} from '@iqss/dataverse-design-system'
import {
  MetadataBlockInfo,
  MetadataField
} from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { CollectionFormHelper } from '../CollectionFormHelper'
import { CollectionFormFacet, FACET_IDS_FIELD, USE_FACETS_FROM_PARENT } from '../CollectionForm'
import { FacetsFromParentCheckbox } from './FacetsFromParentCheckbox'
import styles from './BrowseSearchFacetsSection.module.scss'

interface BrowseSearchFacetsSectionProps {
  defaultCollectionFacets: CollectionFormFacet[]
  allFacetableMetadataFields: MetadataField[]
  allMetadataBlocksInfo: MetadataBlockInfo[]
}

export const BrowseSearchFacetsSection = ({
  defaultCollectionFacets,
  allFacetableMetadataFields,
  allMetadataBlocksInfo
}: BrowseSearchFacetsSectionProps) => {
  const { t } = useTranslation('createCollection')
  const { control } = useFormContext()
  const useBrowseSearchFacetsFromParentCheckedValue = useWatch({
    name: USE_FACETS_FROM_PARENT
  }) as boolean

  // To reset the transfer list when the use browse search facets from parent checkbox changes
  const resetKey = String(useBrowseSearchFacetsFromParentCheckedValue)

  const selectOptions = allMetadataBlocksInfo.map((block) => block.displayName)

  const initialAvailableItems = allFacetableMetadataFields.map((field) => ({
    id: field.name,
    value: field.name,
    label: field.displayName
  }))

  const [availableItems, setAvailableItems] = useState<TransferListItem[]>(initialAvailableItems)

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

  const handleChangeSelectedBlock = (selected: string) => {
    if (selected === '') {
      setAvailableItems(initialAvailableItems)
      return
    }

    const facetableMetadataFieldsWithParentBlockName =
      CollectionFormHelper.assignBlockInfoToFacetableMetadataFields(
        allFacetableMetadataFields,
        allMetadataBlocksInfo
      )

    const filteredByBlockAvailableItems = facetableMetadataFieldsWithParentBlockName
      .filter((field) => field.parentBlockInfo.displayName === selected)
      .map((field) => ({
        id: field.name,
        value: field.name,
        label: field.displayName
      }))

    setAvailableItems(filteredByBlockAvailableItems)
  }

  const resetAvailableItems = () => {
    setAvailableItems(initialAvailableItems)
  }

  return (
    <Row>
      <Col lg={3}>
        <Form.Group.Label>{t('fields.browseSearchFacets.label')}</Form.Group.Label>
      </Col>
      <Col lg={9}>
        <Stack>
          <Form.Group.Text>{t('fields.browseSearchFacets.helperText')}</Form.Group.Text>

          <FacetsFromParentCheckbox
            defaultCollectionFacets={defaultCollectionFacets}
            resetAvailableItems={resetAvailableItems}
          />

          <div className={styles['select-facets-by-block-container']}>
            <SelectAdvanced
              options={selectOptions}
              onChange={handleChangeSelectedBlock}
              isSearchable={false}
              isDisabled={useBrowseSearchFacetsFromParentCheckedValue}
              locales={{ select: 'All Metadata Fields' }}
              key={resetKey}
            />
          </div>

          <div className={styles['transfer-list-container']} data-testid="transfer-list-container">
            <Controller
              name={FACET_IDS_FIELD}
              control={control}
              render={({ field: { onChange } }) => (
                <TransferList
                  onChange={(selectedItems) => handleOnChangeSelectedItems(selectedItems, onChange)}
                  availableItems={availableItems}
                  defaultSelected={defaultCollectionFacets}
                  rightLabel={t('fields.browseSearchFacets.selectedFacets')}
                  disabled={useBrowseSearchFacetsFromParentCheckedValue}
                  key={resetKey}
                />
              )}
            />
          </div>
        </Stack>
      </Col>
    </Row>
  )
}
