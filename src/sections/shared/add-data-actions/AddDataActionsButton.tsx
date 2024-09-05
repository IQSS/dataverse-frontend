import { useTranslation } from 'react-i18next'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { DropdownButton } from '@iqss/dataverse-design-system'
import { PlusLg } from 'react-bootstrap-icons'
import { Route, RouteWithParams } from '../../Route.enum'
import styles from './AddDataActionsButton.module.scss'

interface AddDataActionsButtonProps {
  collectionId?: string
  canAddCollection: boolean
  canAddDataset: boolean
}

export default function AddDataActionsButton({
  collectionId,
  canAddCollection,
  canAddDataset
}: AddDataActionsButtonProps) {
  const { t } = useTranslation('header')

  const createDatasetRoute = collectionId
    ? `${Route.CREATE_DATASET}?collectionId=${collectionId}`
    : Route.CREATE_DATASET

  const createCollectionRoute = RouteWithParams.CREATE_COLLECTION(collectionId)

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
    </DropdownButton>
  )
}

// TODO: AddData Dropdown item needs proper permissions checking, see Spike #318
