import { ForwardedRef, forwardRef } from 'react'
import cn from 'classnames'
import { Dropdown } from 'react-bootstrap'
import { CaretDownFill, Search as SearchIcon, Stars as StarsIcon } from 'react-bootstrap-icons'
import styles from './SearchInput.module.scss'

interface SearchDropdownProps {
  searchEngineSelected: string
  handleSearchEngineSelect: (eventKey: string | null) => void
  position?: 'left' | 'right'
}

export const SearchDropdown = ({
  searchEngineSelected,
  handleSearchEngineSelect,
  position
}: SearchDropdownProps) => {
  return (
    <Dropdown
      className={styles['search-dropdown']}
      align={position === 'left' ? 'start' : 'end'}
      onSelect={handleSearchEngineSelect}>
      <Dropdown.Toggle as={CustomToggle} position={position} />

      <Dropdown.Menu className={styles['search-dropdown-menu']}>
        <Dropdown.Header>Search Engines</Dropdown.Header>
        <Dropdown.Item
          eventKey="one"
          active={searchEngineSelected === 'one'}
          className={styles['search-dropdown-item']}>
          <SearchIcon size={12} />
          Dataverse Engine
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="two"
          active={searchEngineSelected === 'two'}
          className={styles['search-dropdown-item']}>
          <StarsIcon size={12} />
          External Engine 1
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="three"
          active={searchEngineSelected === 'three'}
          className={styles['search-dropdown-item']}>
          <StarsIcon size={12} />
          External Engine 2
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

interface CustomToggleProps {
  onClick: (event: React.MouseEvent<HTMLElement>) => void
  position?: 'left' | 'right'
}

const CustomToggle = forwardRef(({ onClick, position }: CustomToggleProps, ref) => (
  <button
    type="button"
    ref={ref as ForwardedRef<HTMLButtonElement>}
    onClick={(e) => {
      e.preventDefault()
      onClick(e)
    }}
    className={cn(styles['search-dropdown-btn'], {
      [styles['on-the-left']]: position === 'left',
      [styles['on-the-right']]: position === 'right'
    })}>
    <CaretDownFill size={14} />
  </button>
))

CustomToggle.displayName = 'CustomToggle'
