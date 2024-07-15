import { useTranslation } from 'react-i18next'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { DropdownButton } from '@iqss/dataverse-design-system'
import { PlusLg } from 'react-bootstrap-icons'
import { Route } from '../../Route.enum'
import styles from './AddDataActionsButton.module.scss'

interface AddDataActionsButtonProps {
  collectionId?: string
}

export default function AddDataActionsButton({ collectionId }: AddDataActionsButtonProps) {
  const { t } = useTranslation('header')

  const createDatasetRoute = collectionId
    ? `${Route.CREATE_DATASET}?collectionId=${collectionId}`
    : Route.CREATE_DATASET

  return (
    <DropdownButton
      id={'addDataBtn'}
      title={t('navigation.addData')}
      variant="secondary"
      icon={<PlusLg className={styles.icon} />}>
      <Dropdown.Item to={Route.DATASETS} disabled={true} as={Link}>
        {t('navigation.newCollection')}
      </Dropdown.Item>
      <Dropdown.Item to={createDatasetRoute} disabled={false} as={Link}>
        {t('navigation.newDataset')}
      </Dropdown.Item>
    </DropdownButton>
  )
}

// TODO: AddData Dropdown item needs proper permissions checking, see Spike #318
