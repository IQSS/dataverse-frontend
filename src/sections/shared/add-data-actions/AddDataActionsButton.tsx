import { Route } from '../../Route.enum'
import { useTranslation } from 'react-i18next'
import { Dropdown } from 'react-bootstrap'
import { DropdownButton } from '@iqss/dataverse-design-system'
import { PlusLg } from 'react-bootstrap-icons'
import styles from './AddDataActionsButton.module.scss'

export default function AddDataActionsButton() {
  const { t } = useTranslation('header')

  return (
    <DropdownButton
      id={'addDataBtn'}
      title={t('navigation.addData')}
      variant="secondary"
      icon={<PlusLg className={styles.icon} />}>
      <Dropdown.Item href={`/spa${Route.DATASETS}`} disabled={true}>
        {t('navigation.newCollection')}
      </Dropdown.Item>
      <Dropdown.Item href={`/spa${Route.CREATE_DATASET}`} disabled={false}>
        {t('navigation.newDataset')}
      </Dropdown.Item>
    </DropdownButton>
  )
}

// TODO: AddData Dropdown item needs proper permissions checking, see Spike #318
// TODO: Add page for "New Collection", see Issue #319
