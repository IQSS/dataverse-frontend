import { Route } from '../../Route.enum'
import { useTranslation } from 'react-i18next'
import { Dropdown } from 'react-bootstrap'
import { DropdownButton } from '@iqss/dataverse-design-system'
import { PlusLg } from 'react-bootstrap-icons'
import styles from './AddDataActionsButton.module.scss'

const routesToRender = [
  {
    id: 0,
    name: 'New Dataverse',
    page: `/spa${Route.DATASETS}`
  },
  {
    id: 1,
    name: 'New Dataset',
    page: `/spa${Route.CREATE_DATASET}`
  }
]

export default function AddDataActionsButton() {
  const { t } = useTranslation('header')
  const list = routesToRender.map((option) => (
    <Dropdown.Item href={option.page} disabled={false} key={option.id}>
      {option.name}
    </Dropdown.Item>
  ))
  return (
    <div className={'d-flex justify-content-end mb-3'}>
      <DropdownButton
        id={'addDataBtn'}
        title={t('navigation.addData')}
        variant="secondary"
        icon={<PlusLg className={styles.icon} />}>
        <>{list}</>
      </DropdownButton>
    </div>
  )
}

// TODO: AddData Dropdown item needs proper permissions checking, see Spike #318
// TODO: Add page for "New Dataverse", see Issue #319
// TODO: [Q?]Dropdown styles - Add PlusLg icon to right side of button per wireframe
