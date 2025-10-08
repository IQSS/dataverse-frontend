import { useTranslation } from 'react-i18next'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { DropdownButton } from '@iqss/dataverse-design-system'
import { PlusLg } from 'react-bootstrap-icons'
import { RouteWithParams } from '../../Route.enum'
import styles from './AddDataActionsButton.module.scss'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { useGetAvailableDatasetTypes } from '@/dataset/domain/hooks/useGetAvailableDatasetTypes'

interface AddDataActionsButtonProps {
  collectionId: string
  canAddCollection: boolean
  canAddDataset: boolean
  datasetRepository: DatasetRepository
}

export default function AddDataActionsButton({
  collectionId,
  canAddCollection,
  canAddDataset,
  datasetRepository
}: AddDataActionsButtonProps) {
  const { t } = useTranslation('header')

  const createCollectionRoute = RouteWithParams.CREATE_COLLECTION(collectionId)
  const createDatasetRoute = RouteWithParams.CREATE_DATASET(collectionId)
  const { datasetTypes } = useGetAvailableDatasetTypes({ datasetRepository })
  // We skip "dataset" because we hard-code it to appear at the top.
  const nonDatasetDatasetTypes = datasetTypes.filter((type) => type.name !== 'dataset')

  return (
    <DropdownButton
      id={'addDataBtn'}
      title={t('navigation.addData')}
      variant="secondary"
      icon={<PlusLg className={styles.icon} />}>
      <Dropdown.Item to={createCollectionRoute} as={Link} disabled={!canAddCollection}>
        {t('navigation.newCollection')}
      </Dropdown.Item>
      <Dropdown.Item to={createDatasetRoute} as={Link} disabled={!canAddDataset}>
        {t('navigation.newDataset')}
      </Dropdown.Item>
      {/* "Dataset" is hard coded above. Next we show "Software", "Review", etc. */}
      {...nonDatasetDatasetTypes.map((datasetType) => (
        <Dropdown.Item
          key={datasetType.name}
          to={`${createDatasetRoute}?datasetType=${datasetType.name}`}
          as={Link}
          disabled={!canAddDataset}>
          {/* We capitalize the name because we have modified public/locales/en/header.json to include "newReview: New Review" specifically for the "review" dataset type but what about "software" and "workflow" or others we can't even predict? Should the API return the type in right language? Or should we continue to add types we think we'll want to support in header.json? And what if a name has a space in it? */}
          {t(
            `navigation.new${datasetType.name.charAt(0).toUpperCase() + datasetType.name.slice(1)}`
          )}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  )
}
