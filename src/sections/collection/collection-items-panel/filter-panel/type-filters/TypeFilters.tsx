import { ChangeEvent } from 'react'
import { Form, Icon, IconName, Stack } from '@iqss/dataverse-design-system'
import { CollectionItemType } from '../../../../../collection/domain/models/CollectionItemType'
import styles from './TypeFilters.module.scss'

interface TypeFiltersProps {
  currentItemTypes?: CollectionItemType[]
  onItemTypesChange: (itemTypeChange: ItemTypeChange) => void
  isLoadingCollectionItems: boolean
}

export interface ItemTypeChange {
  type: CollectionItemType
  checked: boolean
}

export const TypeFilters = ({
  currentItemTypes,
  onItemTypesChange,
  isLoadingCollectionItems
}: TypeFiltersProps) => {
  const handleItemTypeChange = (type: CollectionItemType, checked: boolean) => {
    onItemTypesChange({ type, checked })
  }

  const collectionCheckDisabled =
    isLoadingCollectionItems ||
    (currentItemTypes?.length === 1 && currentItemTypes?.includes(CollectionItemType.COLLECTION))

  const datasetCheckDisabled =
    isLoadingCollectionItems ||
    (currentItemTypes?.length === 1 && currentItemTypes?.includes(CollectionItemType.DATASET))

  const fileCheckDisabled =
    isLoadingCollectionItems ||
    (currentItemTypes?.length === 1 && currentItemTypes?.includes(CollectionItemType.FILE))

  return (
    <Stack gap={1} className={styles['type-filters']}>
      <Form.Group.Checkbox
        id="collections-type-check"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleItemTypeChange(CollectionItemType.COLLECTION, e.target.checked)
        }
        label={
          <>
            <Icon name={IconName.COLLECTION} />
            <span>Collections (19)</span>
          </>
        }
        checked={Boolean(currentItemTypes?.includes(CollectionItemType.COLLECTION))}
        disabled={collectionCheckDisabled}
      />
      <Form.Group.Checkbox
        id="datasets-type-check"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleItemTypeChange(CollectionItemType.DATASET, e.target.checked)
        }
        label={
          <>
            <Icon name={IconName.DATASET} />
            <span>Datasets (32)</span>
          </>
        }
        checked={Boolean(currentItemTypes?.includes(CollectionItemType.DATASET))}
        disabled={datasetCheckDisabled}
      />
      <Form.Group.Checkbox
        id="files-type-check"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleItemTypeChange(CollectionItemType.FILE, e.target.checked)
        }
        label={
          <>
            <Icon name={IconName.FILE} />
            <span>Files (10,081)</span>
          </>
        }
        checked={Boolean(currentItemTypes?.includes(CollectionItemType.FILE))}
        disabled={fileCheckDisabled}
      />
    </Stack>
  )
}
