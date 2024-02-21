import { Route } from '../../Route.enum'
import { useTranslation } from 'react-i18next'
import { Dropdown } from 'react-bootstrap'
import { DropdownButton } from '@iqss/dataverse-design-system'
import { PlusLg } from 'react-bootstrap-icons'

// interface DropdownOptionProps {
//   options: { id: number; name: string; page: string }[]
// }
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

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const CustomToggle = React.forwardRef<HTMLDivElement, any>(({ children, onClick }, ref) => (
//   <>
//     <Button
//       ref={ref}
//       onClick={(e: MouseEvent<HTMLAnchorElement>) => {
//         e.preventDefault()
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//         onClick(e)
//       }}>
//       {children}
//       &#x25bc;
//     </Button>
//   </>
// ))
// CustomToggle.displayName = 'Add Data +'

export default function AddDataActionsButton() {
  const { t } = useTranslation('header')
  const list = routesToRender.map((option) => (
    <Dropdown.Item href={option.page} disabled={false} key={option.id}>
      {option.name}
    </Dropdown.Item>
  ))
  return (
    <div className={'d-flex justify-content-end mb-3'}>
      {/* <Dropdown
        as={ButtonGroup}
        title={t('navigation.addData')}
        id="dropdown-1"
        variant="secondary">
        <Dropdown.Toggle as={CustomToggle} id="demo-btn">
          Test
        </Dropdown.Toggle>
        <Dropdown.Menu>{list}</Dropdown.Menu>
      </Dropdown> */}
      <DropdownButton
        // asButtonGroup
        title={t('navigation.addData')}
        id={'addDataBtn'}
        // name={t('navigation.addData')}
        variant="secondary"
        icon={<PlusLg aria-label="foo" />}>
        <>{list}</>
      </DropdownButton>
    </div>
  )
}

// TODO: AddData Dropdown item needs proper permissions checking, see Spike #XXX
// TODO: Add page for "New Dataverse", see Issue #XXX
// TODO: Dropdown styles - Add PlusLg icon to right side of button
