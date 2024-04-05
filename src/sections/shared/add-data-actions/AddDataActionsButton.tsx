import { useTranslation } from 'react-i18next'
import { Dropdown } from 'react-bootstrap'
import { Link, useSearchParams } from 'react-router-dom'
import { DropdownButton } from '@iqss/dataverse-design-system'
import { PlusLg } from 'react-bootstrap-icons'
import { Route } from '../../Route.enum'
import styles from './AddDataActionsButton.module.scss'

export default function AddDataActionsButton() {
  const { t } = useTranslation('header')
  const [searchParams] = useSearchParams()
  const collectionId = searchParams.get('id') ?? undefined

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
// TODO: Add page for "New Collection", see Issue #319
