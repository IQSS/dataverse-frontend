import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Icon, IconName, Stack } from '@iqss/dataverse-design-system'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { CountPerObjectType } from '@/collection/domain/models/CollectionItemSubset'
import styles from './TypeFilters.module.scss'

interface TypeFiltersProps {
  currentItemTypes?: CollectionItemType[]
  onItemTypesChange: (itemTypeChange: ItemTypeChange) => void
  isLoadingCollectionItems: boolean
  countPerObjectType: CountPerObjectType
}

export interface ItemTypeChange {
  type: CollectionItemType
  checked: boolean
}

export const TypeFilters = ({
  currentItemTypes,
  onItemTypesChange,
  isLoadingCollectionItems,
  countPerObjectType
}: TypeFiltersProps) => {
  const { t } = useTranslation('collection')

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

            <span>
              {t('collectionFilterTypeLabel')}{' '}
              <small>{`(${Intl.NumberFormat().format(countPerObjectType.collections)})`}</small>
            </span>
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
            <span>
              {t('datasetFilterTypeLabel')}{' '}
              <small>{`(${Intl.NumberFormat().format(countPerObjectType.datasets)})`}</small>
            </span>
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
            <span>
              {t('fileFilterTypeLabel')}{' '}
              <small>{`(${Intl.NumberFormat().format(countPerObjectType.files)})`}</small>
            </span>
          </>
        }
        checked={Boolean(currentItemTypes?.includes(CollectionItemType.FILE))}
        disabled={fileCheckDisabled}
      />
    </Stack>
  )
}
